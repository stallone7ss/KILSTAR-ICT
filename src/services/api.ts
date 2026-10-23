import { FormSubmission, SubmissionInput, DatabaseStats } from '../types/database';

const TOKEN_KEY = 'kilsta_admin_token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Ignore storage issues
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'x-admin-token': token,
    };
  }
  return {};
}

// Admin Authentication API
export async function loginAdmin(password: string): Promise<{ success: boolean; token: string; expiresAt: number }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }

  setAdminToken(data.token);
  return data;
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/verify', {
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore
  } finally {
    clearAdminToken();
  }
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update administrator password');
  }
}

// Protected: Submissions Queries
export async function fetchSubmissions(filters?: {
  form_type?: string;
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ submissions: FormSubmission[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.form_type && filters.form_type !== 'all') params.append('form_type', filters.form_type);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.offset) params.append('offset', String(filters.offset));

  const res = await fetch(`/api/submissions?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('UNAUTHORIZED_ADMIN');
    }
    throw new Error(`Failed to load submissions: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSubmissionById(id: number): Promise<FormSubmission> {
  const res = await fetch(`/api/submissions/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED_ADMIN');
    throw new Error(`Failed to load submission: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchStats(): Promise<DatabaseStats> {
  const res = await fetch('/api/submissions/stats', {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED_ADMIN');
    throw new Error(`Failed to load stats: ${res.statusText}`);
  }
  return res.json();
}

// Public: Submit Form (Any website client can submit without password)
export async function submitForm(data: SubmissionInput): Promise<FormSubmission> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Submission failed with status ${res.status}`);
  }

  return res.json();
}

// Protected: Update Submission
export async function updateSubmission(
  id: number,
  updates: Partial<Pick<FormSubmission, 'status' | 'priority' | 'internal_notes' | 'subject' | 'message'>>
): Promise<FormSubmission> {
  const res = await fetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED_ADMIN');
    throw new Error(`Failed to update submission: ${res.statusText}`);
  }

  return res.json();
}

// Protected: Delete Submission
export async function deleteSubmission(id: number): Promise<void> {
  const res = await fetch(`/api/submissions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED_ADMIN');
    throw new Error(`Failed to delete submission: ${res.statusText}`);
  }
}

// Protected: Reseed
export async function reseedDatabase(forceReset: boolean = false): Promise<void> {
  const res = await fetch('/api/submissions/seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ forceReset }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED_ADMIN');
    throw new Error('Failed to reset and reseed database');
  }
}

// Export URL with attached token
export function getExportUrl(format: 'csv' | 'json'): string {
  const token = getAdminToken();
  return `/api/submissions/export?format=${format}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
}
