import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

/**
 * Generate a unique, trackable KILSTAR client reference code.
 * Format: KIL-YYMMDD-XXXX (e.g., KIL-261023-8E4A)
 */
function generateRefCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KIL-${yy}${mm}${dd}-${randomSuffix}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for flexible cross-origin / preview domains in Codespaces
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Only POST submissions are supported.`,
    });
  }

  // Verify Database Connection String
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL in environment variables.');
    return res.status(500).json({
      success: false,
      error: 'Server misconfiguration: Neon DATABASE_URL environment variable is not defined.',
    });
  }

  try {
    // Neon Serverless connection instance
    const sql = neon(databaseUrl);

    // Parse payload (Vercel automatically parses JSON bodies, with fallback)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const {
      form_type,
      full_name,
      fullName,
      email,
      phone,
      organization,
      company,
      service_category,
      service,
      message,
      preferred_date,
      preferredDate,
      audit_scope,
      auditScope,
      metadata = {},
    } = body;

    // Normalizing field names
    const resolvedFormType = (form_type || 'contact').toLowerCase().trim();
    const resolvedFullName = String(full_name || fullName || '').trim();
    const resolvedEmail = String(email || '').trim().toLowerCase();
    const resolvedPhone = phone ? String(phone).trim() : null;
    const resolvedOrg = (organization || company) ? String(organization || company).trim() : null;
    const resolvedService = (service_category || service) ? String(service_category || service).trim() : null;
    const resolvedMessage = message ? String(message).trim() : null;
    const resolvedPrefDate = (preferred_date || preferredDate) ? String(preferred_date || preferredDate).trim() : null;
    const resolvedAuditScope = (audit_scope || auditScope) ? String(audit_scope || auditScope).trim() : null;

    // Validation checks
    if (!resolvedFullName) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!resolvedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!['contact', 'audit_booking'].includes(resolvedFormType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid form_type: "${resolvedFormType}". Supported types are 'contact' or 'audit_booking'.`,
      });
    }

    if (resolvedFormType === 'contact' && !resolvedMessage) {
      return res.status(400).json({ success: false, error: 'Message content is required for contact inquiries.' });
    }

    // Generate unique reference ID
    const refCode = generateRefCode();

    // Prepare JSON metadata payload
    const submissionMeta = {
      ...metadata,
      submitted_via: 'vercel_serverless_neon',
      client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
    };

    // Execute SQL insertion into Neon Postgres
    const rows = await sql`
      INSERT INTO submissions (
        ref_code,
        form_type,
        full_name,
        email,
        phone,
        organization,
        service_category,
        message,
        preferred_date,
        audit_scope,
        metadata
      ) VALUES (
        ${refCode},
        ${resolvedFormType},
        ${resolvedFullName},
        ${resolvedEmail},
        ${resolvedPhone},
        ${resolvedOrg},
        ${resolvedService},
        ${resolvedMessage},
        ${resolvedPrefDate},
        ${resolvedAuditScope},
        ${JSON.stringify(submissionMeta)}
      )
      RETURNING id, ref_code, form_type, full_name, email, created_at;
    `;

    const inserted = rows[0];

    return res.status(201).json({
      success: true,
      ref_code: refCode,
      message:
        resolvedFormType === 'audit_booking'
          ? `Your ICT Audit consultation request has been logged under reference ${refCode}. Our lead technical consultant will reach out shortly.`
          : `Your inquiry has been received with tracking reference ${refCode}. We will get back to you within 24 hours.`,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Neon SQL Submission Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Database query failed while processing submission.',
    });
  }
}
