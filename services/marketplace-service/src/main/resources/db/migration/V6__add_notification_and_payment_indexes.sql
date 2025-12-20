CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type_created ON notifications(type, created_at);

CREATE INDEX IF NOT EXISTS idx_jobs_status_created_client ON jobs(status, created_at, client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status_created_job ON proposals(status, created_at, job_id);

CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);

CREATE INDEX IF NOT EXISTS idx_jobs_client_status_created ON jobs(client_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_status_created ON proposals(freelancer_id, status, created_at);
