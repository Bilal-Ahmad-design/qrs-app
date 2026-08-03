-- Create form_submissions table for tracking all form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id SERIAL PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  turnstile_verified BOOLEAN DEFAULT FALSE,
  review_status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_form_type (form_type),
  INDEX idx_email (email),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_review_status (review_status)
);

-- Create audit_logs table for tracking all CMS changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  table_name VARCHAR(255) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_table_name (table_name),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp)
);

-- Create redirects table
CREATE TABLE IF NOT EXISTS redirects (
  id SERIAL PRIMARY KEY,
  source_path VARCHAR(255) NOT NULL UNIQUE,
  destination_path VARCHAR(255) NOT NULL,
  type VARCHAR(10) DEFAULT '301',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_source_path (source_path)
);

-- Add permissions column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
