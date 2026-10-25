-- ==============================================================================
-- KILSTAR-ICT: Neon Serverless PostgreSQL Initialization Script
-- Run this script inside the Neon SQL Console (https://console.neon.tech)
-- or execute it via psql connected to your Neon database instance.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  ref_code VARCHAR(32) UNIQUE NOT NULL,
  form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('contact', 'audit_booking')),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  organization VARCHAR(255),
  service_category VARCHAR(100),
  message TEXT,
  preferred_date VARCHAR(50),
  audit_scope VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for instant ticket and reference code lookups by clients and staff
CREATE INDEX IF NOT EXISTS idx_submissions_ref_code ON submissions(ref_code);

-- Index for filtering by form type (e.g. all ICT Audits or Inquiries)
CREATE INDEX IF NOT EXISTS idx_submissions_form_type ON submissions(form_type);

-- Index for timestamp sorting in administrative dashboards
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
