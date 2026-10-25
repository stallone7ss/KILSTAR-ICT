export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  status?: 'new' | 'in_review' | 'resolved' | 'archived';
  created_at?: string;
}

export interface QuoteSubmission {
  id?: number;
  client_name: string;
  email: string;
  phone?: string;
  business_type?: string;
  project_scope: string;
  estimated_budget?: string;
  timeline?: string;
  additional_details?: string;
  status?: 'pending' | 'analyzed' | 'proposal_sent' | 'accepted' | 'declined';
  created_at?: string;
}

export interface SubscriberSubmission {
  id?: number;
  email: string;
  full_name?: string;
  source?: string;
  is_active?: number;
  created_at?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  module?: string;
  id?: number | null;
  message?: string;
  error?: string;
  record?: T;
  data?: Record<string, any>;
  timestamp?: string;
}

export interface AlertState {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp?: number;
  id?: number | string;
  ref_code?: string;
}

export interface NeonSubmission {
  id?: number;
  ref_code: string;
  form_type: 'contact' | 'audit_booking';
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  service_category?: string;
  message?: string;
  preferred_date?: string;
  audit_scope?: string;
  metadata?: Record<string, any>;
  status?: string;
  created_at?: string;
}

export interface SubmitApiResponse {
  success: boolean;
  ref_code?: string;
  message?: string;
  error?: string;
  data?: any;
}

