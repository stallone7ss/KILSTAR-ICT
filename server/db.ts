import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export interface FormSubmission {
  id: number;
  ref_code: string;
  form_type: 'contact' | 'audit_booking' | 'service_quote' | 'training_registration' | 'sme_advisory' | 'newsletter';
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  location?: string;
  subject?: string;
  service_category?: string;
  message?: string;
  status: 'new' | 'in_review' | 'contacted' | 'scheduled' | 'completed' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  payload: Record<string, any>;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export type SubmissionInput = Omit<FormSubmission, 'id' | 'ref_code' | 'created_at' | 'updated_at' | 'status' | 'priority' | 'internal_notes'> & {
  status?: FormSubmission['status'];
  priority?: FormSubmission['priority'];
  internal_notes?: string;
};

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kilsta_database.db');
const JSON_BACKUP_FILE = path.join(DATA_DIR, 'kilsta_submissions.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    dbInstance.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;

      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS form_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ref_code TEXT UNIQUE NOT NULL,
        form_type TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        organization TEXT,
        location TEXT,
        subject TEXT,
        service_category TEXT,
        message TEXT,
        status TEXT DEFAULT 'new',
        priority TEXT DEFAULT 'normal',
        payload TEXT DEFAULT '{}',
        internal_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_submissions_form_type ON form_submissions (form_type);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON form_submissions (status);
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON form_submissions (created_at DESC);
    `);
  }
  return dbInstance;
}

export function initAdminAuth() {
  const db = getDb();
  const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
  if (!row) {
    db.prepare("INSERT INTO admin_settings (key, value) VALUES ('admin_password', ?)").run('kilsta2026');
    console.log('[Admin Auth] Initialized default admin password: kilsta2026');
  }
}

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  const db = getDb();
  const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as any;
  return row && row.value === password.trim();
}

export function changeAdminPassword(oldPass: string, newPass: string): boolean {
  if (!verifyAdminPassword(oldPass)) return false;
  const db = getDb();
  db.prepare("UPDATE admin_settings SET value = ? WHERE key = 'admin_password'").run(newPass.trim());
  return true;
}

export function createAdminSession(): { token: string; expiresAt: number } {
  const db = getDb();
  const token = 'kil_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Date.now().toString(36);
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
  db.prepare("INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)").run(token, now, expiresAt);
  return { token, expiresAt };
}

export function validateAdminToken(token: string): boolean {
  if (!token) return false;
  const db = getDb();
  const now = Date.now();
  const row = db.prepare("SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?").get(token, now) as any;
  return Boolean(row);
}

export function destroyAdminSession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
}

function generateRefCode(formType: string): string {
  const prefixMap: Record<string, string> = {
    contact: 'CNT',
    audit_booking: 'AUD',
    service_quote: 'QUO',
    training_registration: 'TRN',
    sme_advisory: 'SME',
    newsletter: 'RES',
  };
  const prefix = prefixMap[formType] || 'KIL';
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${random}`;
}

function syncToJsonBackup() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM form_submissions ORDER BY id DESC').all() as any[];
    const parsed = rows.map(r => ({
      ...r,
      payload: safeJsonParse(r.payload),
    }));
    fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to sync JSON backup:', err);
  }
}

function safeJsonParse(str: string): Record<string, any> {
  try {
    return JSON.parse(str || '{}');
  } catch {
    return {};
  }
}

const SAMPLE_SUBMISSIONS: SubmissionInput[] = [
  {
    form_type: 'audit_booking',
    full_name: 'Donald Tau',
    email: 'd.tau@samaraicocoa.com.pg',
    phone: '+675 7321 4489',
    organization: 'Samarai-Murua Cocoa Farmers Cooperative',
    location: 'Alotau / Samarai-Murua',
    subject: 'Comprehensive IT & Inventory Systems Audit',
    service_category: 'ICT Infrastructure & Audit',
    message: 'We manage cocoa distribution across 4 island clusters. Our current desktop computers frequently crash and we need a reliable network, solar-ready backup, and stock management software before the peak harvest season.',
    status: 'in_review',
    priority: 'high',
    internal_notes: 'Urgent harvest timeline. Stallone to schedule in-person consultation at Alotau harbour wharf branch next Tuesday.',
    payload: {
      preferredDate: '2026-11-05',
      teamSize: '15-25 staff',
      auditFocus: 'Inventory management software, internet connectivity, and off-grid solar power backup resilience',
      currentSetup: '3 legacy desktop PCs, manual paper ledgers, mobile hotspot',
      estimatedBudget: 'K10,000 - K15,000 PGK'
    }
  },
  {
    form_type: 'training_registration',
    full_name: 'Grace Wesley',
    email: 'gwesley@mbpha.gov.pg',
    phone: '+675 7098 1234',
    organization: 'Milne Bay Provincial Health Authority',
    location: 'Alotau General Hospital',
    subject: 'Corporate Excel & Medical Records Skills Training',
    service_category: 'ICT Training & Skills',
    message: 'We require structured hands-on computer training for 8 ward supervisors in Microsoft Excel formulas, patient admissions tracking, and secure digital records.',
    status: 'scheduled',
    priority: 'normal',
    internal_notes: 'Quotation sent (K4,800 total for 8 candidates). Awaiting formal LPO from PHA procurement officer.',
    payload: {
      courseName: 'Microsoft Excel Masterclass for Business & Administration',
      participantCount: 8,
      cohort: 'Cohort Nov-2026 (Evening sessions)',
      skillLevel: 'Beginner to Intermediate',
      customCurriculumNeeded: true
    }
  },
  {
    form_type: 'sme_advisory',
    full_name: 'Kila Balo',
    email: 'tours@tawaliecodive.pg',
    phone: '+675 7155 6780',
    organization: 'Tawali Eco-Dive & Marine Tours',
    location: 'East Cape, Milne Bay',
    subject: 'IPA Business Name Renewal & IRC Tax Compliance (TIN / COC)',
    service_category: 'Business Advisory & IPA Compliance',
    message: 'We are applying for the Milne Bay Tourism Authority promotional grant and urgently need to update our IPA annual returns and obtain an IRC Certificate of Compliance (COC).',
    status: 'contacted',
    priority: 'urgent',
    internal_notes: 'Prepared IPA Form 3 and IRC statement of affairs. Customer visited office on Monday; documents filed at IPA online registry.',
    payload: {
      registrationType: 'IPA Business Name Renewal & IRC COC',
      currentTIN: 'TIN Application in progress',
      requiresBookkeeping: true,
      annualReturnStatus: 'Overdue 1 year',
      grantDeadline: '2026-11-15'
    }
  },
  {
    form_type: 'service_quote',
    full_name: 'Mathew Kaidoga',
    email: 'm.kaidoga@masurina.com.pg',
    phone: '+675 825 1200',
    organization: 'Masurina Lodge & Conference Centre',
    location: 'Town Centre, Alotau',
    subject: 'Structured Cabling, IP CCTV Installation & Guest Wi-Fi',
    service_category: 'ICT Infrastructure & Security',
    message: 'We are expanding our guest accommodation wing with 14 new chalets and need complete structured network cabling, guest portal Wi-Fi, and 12 outdoor night-vision IP CCTV cameras.',
    status: 'new',
    priority: 'high',
    internal_notes: 'High value commercial project. Site inspection scheduled for Friday 9:00 AM.',
    payload: {
      budgetRange: 'K20,000 - K35,000 PGK',
      timeline: 'Within 30-45 days',
      cctvChannels: 16,
      wifiCoverage: 'Whole compound (indoor & outdoor chalets)',
      ongoingMaintenance: true
    }
  },
  {
    form_type: 'contact',
    full_name: 'Patricia Charles',
    email: 'pcharles@alotau-school.ac.pg',
    phone: '+675 8254 3901',
    organization: 'Alotau International School',
    location: 'Education Hill, Alotau',
    subject: 'Computer Lab Servicing & Student Cyber Safety Seminar',
    service_category: 'ICT Support & Training',
    message: 'Our school computer lab has 18 desktop computers needing virus cleanups, Windows updates, and software licensing checks. Also interested in a half-day seminar for teachers on cyber hygiene.',
    status: 'new',
    priority: 'normal',
    internal_notes: 'Called back and left voicemail. Stallone to follow up by email.',
    payload: {
      preferredContact: 'Email and WhatsApp',
      schoolTerm: 'Term 4'
    }
  },
  {
    form_type: 'newsletter',
    full_name: 'Peter Sioni',
    email: 'psioni@mbchamber.org.pg',
    phone: '+675 7654 3210',
    organization: 'Milne Bay Chamber of Commerce & Industry',
    location: 'Alotau',
    subject: 'Downloaded: Milne Bay SME Digital Compliance Guide 2026',
    service_category: 'Resources & Advisory',
    message: 'Subscriber downloaded the Milne Bay SME Digital Transformation & IPA/IRC Compliance Checklist.',
    status: 'completed',
    priority: 'low',
    internal_notes: 'Sent automated resource link. Add to monthly business newsletter distribution list.',
    payload: {
      resourceName: 'Milne Bay SME Digital Compliance Guide 2026',
      subscribedNewsletter: true
    }
  }
];

export function initDb() {
  const db = getDb();
  initAdminAuth();
  const countRow = db.prepare('SELECT COUNT(*) as count FROM form_submissions').get() as { count: number };
  if (countRow.count === 0) {
    console.log('Seeding initial Milne Bay form submissions...');
    seedSampleData(false);
  }
}

export function seedSampleData(forceReset: boolean = false) {
  const db = getDb();
  if (forceReset) {
    db.exec('DELETE FROM form_submissions');
  }

  const insert = db.prepare(`
    INSERT INTO form_submissions (
      ref_code, form_type, full_name, email, phone, organization, location,
      subject, service_category, message, status, priority, payload,
      internal_notes, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const now = new Date();
  SAMPLE_SUBMISSIONS.forEach((sub, i) => {
    const createdDate = new Date(now.getTime() - (SAMPLE_SUBMISSIONS.length - i) * 86400000 * 2.5);
    const dateStr = createdDate.toISOString();
    insert.run(
      generateRefCode(sub.form_type),
      sub.form_type,
      sub.full_name,
      sub.email,
      sub.phone || '',
      sub.organization || '',
      sub.location || 'Alotau, Milne Bay',
      sub.subject || '',
      sub.service_category || 'General',
      sub.message || '',
      sub.status || 'new',
      sub.priority || 'normal',
      JSON.stringify(sub.payload || {}),
      sub.internal_notes || '',
      dateStr,
      dateStr
    );
  });

  syncToJsonBackup();
}

export function getAllSubmissions(filters: {
  form_type?: string;
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = getDb();
  let sql = 'SELECT * FROM form_submissions WHERE 1=1';
  const params: any[] = [];

  if (filters.form_type && filters.form_type !== 'all') {
    sql += ' AND form_type = ?';
    params.push(filters.form_type);
  }

  if (filters.status && filters.status !== 'all') {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.priority && filters.priority !== 'all') {
    sql += ' AND priority = ?';
    params.push(filters.priority);
  }

  if (filters.search && filters.search.trim()) {
    const term = `%${filters.search.trim()}%`;
    sql += ' AND (full_name LIKE ? OR organization LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ? OR ref_code LIKE ?)';
    params.push(term, term, term, term, term, term);
  }

  // Count total matching
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
  const countRes = db.prepare(countSql).get(...params) as { total: number };

  sql += ' ORDER BY id DESC';

  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  const rows = db.prepare(sql).all(...params) as any[];
  const parsedRows: FormSubmission[] = rows.map(r => ({
    ...r,
    payload: safeJsonParse(r.payload),
  }));

  return {
    submissions: parsedRows,
    total: countRes.total,
  };
}

export function getSubmissionById(id: number): FormSubmission | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM form_submissions WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    ...row,
    payload: safeJsonParse(row.payload),
  };
}

export function createSubmission(data: SubmissionInput): FormSubmission {
  const db = getDb();
  const refCode = generateRefCode(data.form_type);
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO form_submissions (
      ref_code, form_type, full_name, email, phone, organization, location,
      subject, service_category, message, status, priority, payload,
      internal_notes, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const result = stmt.run(
    refCode,
    data.form_type,
    data.full_name,
    data.email,
    data.phone || '',
    data.organization || '',
    data.location || 'Milne Bay Province',
    data.subject || `${data.form_type.replace('_', ' ').toUpperCase()} Inquiry`,
    data.service_category || 'General',
    data.message || '',
    data.status || 'new',
    data.priority || 'normal',
    JSON.stringify(data.payload || {}),
    data.internal_notes || '',
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  syncToJsonBackup();

  const created = getSubmissionById(newId);
  if (!created) {
    throw new Error('Failed to retrieve newly created submission');
  }
  return created;
}

export function updateSubmission(
  id: number,
  updates: Partial<Pick<FormSubmission, 'status' | 'priority' | 'internal_notes' | 'subject' | 'message'>>
): FormSubmission | null {
  const db = getDb();
  const current = getSubmissionById(id);
  if (!current) return null;

  const now = new Date().toISOString();
  const status = updates.status !== undefined ? updates.status : current.status;
  const priority = updates.priority !== undefined ? updates.priority : current.priority;
  const internal_notes = updates.internal_notes !== undefined ? updates.internal_notes : (current.internal_notes || '');
  const subject = updates.subject !== undefined ? updates.subject : (current.subject || '');
  const message = updates.message !== undefined ? updates.message : (current.message || '');

  db.prepare(`
    UPDATE form_submissions
    SET status = ?, priority = ?, internal_notes = ?, subject = ?, message = ?, updated_at = ?
    WHERE id = ?
  `).run(status, priority, internal_notes, subject, message, now, id);

  syncToJsonBackup();
  return getSubmissionById(id);
}

export function deleteSubmission(id: number): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM form_submissions WHERE id = ?').run(id);
  syncToJsonBackup();
  return res.changes > 0;
}

export function getDatabaseStats() {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as c FROM form_submissions').get() as any).c;
  
  const byTypeRows = db.prepare('SELECT form_type, COUNT(*) as c FROM form_submissions GROUP BY form_type').all() as any[];
  const byType: Record<string, number> = {};
  byTypeRows.forEach(r => { byType[r.form_type] = r.c; });

  const byStatusRows = db.prepare('SELECT status, COUNT(*) as c FROM form_submissions GROUP BY status').all() as any[];
  const byStatus: Record<string, number> = {};
  byStatusRows.forEach(r => { byStatus[r.status] = r.c; });

  const byPriorityRows = db.prepare('SELECT priority, COUNT(*) as c FROM form_submissions GROUP BY priority').all() as any[];
  const byPriority: Record<string, number> = {};
  byPriorityRows.forEach(r => { byPriority[r.priority] = r.c; });

  const recent = db.prepare('SELECT * FROM form_submissions ORDER BY id DESC LIMIT 5').all() as any[];

  return {
    total,
    byType,
    byStatus,
    byPriority,
    recent: recent.map(r => ({ ...r, payload: safeJsonParse(r.payload) })),
  };
}

export function exportSubmissionsData(format: 'json' | 'csv'): string {
  const { submissions } = getAllSubmissions({ limit: 10000 });
  if (format === 'json') {
    return JSON.stringify(submissions, null, 2);
  }

  // Generate CSV
  const headers = [
    'ID',
    'Reference Code',
    'Form Type',
    'Full Name',
    'Email',
    'Phone',
    'Organization',
    'Location',
    'Subject',
    'Service Category',
    'Status',
    'Priority',
    'Created At',
    'Internal Notes',
    'Custom Payload'
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = submissions.map(s => [
    s.id,
    s.ref_code,
    s.form_type,
    escapeCsv(s.full_name),
    escapeCsv(s.email),
    escapeCsv(s.phone),
    escapeCsv(s.organization),
    escapeCsv(s.location),
    escapeCsv(s.subject),
    escapeCsv(s.service_category),
    s.status,
    s.priority,
    s.created_at,
    escapeCsv(s.internal_notes),
    escapeCsv(JSON.stringify(s.payload)),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
