-- V1__complete_schema_and_seed_data.sql
-- Complete Marketplace Database Schema with All Tables and Test Data
-- Consolidated migration for easier testing and development

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'FREELANCER',
    bio TEXT,
    profile_image_url VARCHAR(500),
    location VARCHAR(100),
    phone VARCHAR(20),
    hourly_rate DECIMAL(10, 2),
    skills TEXT[],
    portfolio_url VARCHAR(500),
    stripe_customer_id VARCHAR(100),
    stripe_account_id VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role CHECK (role IN ('CLIENT', 'FREELANCER', 'ADMIN'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Jobs table
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    required_skills TEXT[],
    budget DECIMAL(10, 2),
    budget_type VARCHAR(20) DEFAULT 'FIXED',
    duration INTEGER,
    experience_level VARCHAR(20) DEFAULT 'INTERMEDIATE',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    proposal_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    CONSTRAINT check_budget_type CHECK (budget_type IN ('FIXED', 'HOURLY')),
    CONSTRAINT check_experience CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'EXPERT')),
    CONSTRAINT check_status CHECK (status IN ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'))
);

CREATE INDEX idx_jobs_client ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_jobs_budget ON jobs(budget);
CREATE INDEX idx_jobs_status_created_client ON jobs(status, created_at, client_id);

-- Proposals table
CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    proposed_rate DECIMAL(10, 2) NOT NULL,
    estimated_duration INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    client_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, freelancer_id),
    CONSTRAINT check_proposal_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'))
);

CREATE INDEX idx_proposals_job ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at);
CREATE INDEX idx_notifications_type_created ON notifications(type, created_at);

-- ============================================================================
-- PAYMENT AND ESCROW TABLES
-- ============================================================================

-- Payments table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    proposal_id BIGINT REFERENCES proposals(id),
    amount BIGINT NOT NULL,
    platform_fee BIGINT DEFAULT 0,
    freelancer_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    escrow_status VARCHAR(50) DEFAULT 'NOT_ESCROWED',
    stripe_payment_method VARCHAR(255),
    stripe_receipt_url TEXT,
    failure_code VARCHAR(100),
    failure_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    released_at TIMESTAMP,
    refunded_at TIMESTAMP,
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED')),
    CONSTRAINT chk_escrow_status CHECK (escrow_status IN ('NOT_ESCROWED', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'))
);

CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_freelancer ON payments(freelancer_id);
CREATE INDEX idx_payments_job ON payments(job_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);

-- Escrow table
CREATE TABLE escrow (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'HELD',
    release_condition VARCHAR(100) DEFAULT 'JOB_COMPLETED',
    auto_release_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    CONSTRAINT chk_escrow_escrow_status CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')),
    CONSTRAINT chk_escrow_release_condition CHECK (release_condition IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED'))
);

CREATE INDEX idx_escrow_payment ON escrow(payment_id);
CREATE INDEX idx_escrow_job ON escrow(job_id);
CREATE INDEX idx_escrow_status ON escrow(status);

-- Payment History table
CREATE TABLE payment_history (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_history_payment ON payment_history(payment_id);
CREATE INDEX idx_payment_history_created ON payment_history(created_at);

-- Invoices table
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    amount BIGINT NOT NULL,
    platform_fee BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    issued_at TIMESTAMP,
    due_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_invoice_status CHECK (status IN ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'))
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_freelancer ON invoices(freelancer_id);
CREATE INDEX idx_invoices_payment ON invoices(payment_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create trigger to automatically update updated_at on invoices changes
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();

-- ============================================================================
-- MILESTONES TABLE
-- ============================================================================

CREATE TABLE milestones (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    proposal_id BIGINT REFERENCES proposals(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    due_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_id BIGINT REFERENCES payments(id),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    approved_at TIMESTAMP,
    CONSTRAINT chk_milestone_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'PAID', 'CANCELLED'))
);

CREATE INDEX idx_milestones_job ON milestones(job_id);
CREATE INDEX idx_milestones_proposal ON milestones(proposal_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_payment ON milestones(payment_id);

-- ============================================================================
-- SEED DATA - Test Users (Password: password123 for all)
-- ============================================================================

INSERT INTO users (email, username, password_hash, full_name, role, bio, location, hourly_rate, skills, email_verified, is_active, rating_avg, rating_count, created_at, updated_at) VALUES
-- Admin user
('admin@designermarket.com', 'admin', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Admin User', 'ADMIN', 'System Administrator', 'Global', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Clients
('client1@example.com', 'client_john', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'John Client', 'CLIENT', 'Looking for talented designers for my startup projects', 'New York, USA', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client2@example.com', 'client_sarah', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Sarah Johnson', 'CLIENT', 'Need help with mobile app design', 'London, UK', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client3@example.com', 'client_mike', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Mike Chen', 'CLIENT', 'Running an e-commerce business', 'Singapore', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client4@example.com', 'client_emma', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Emma Davis', 'CLIENT', 'Marketing agency owner', 'Sydney, Australia', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client5@example.com', 'client_alex', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Alex Brown', 'CLIENT', 'Tech startup founder', 'San Francisco, USA', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Freelancers
('freelancer1@example.com', 'designer_lisa', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Lisa Designer', 'FREELANCER', 'Senior UI/UX designer with 8+ years experience', 'Berlin, Germany', 85.00, ARRAY['UI Design', 'UX Design', 'Figma', 'Adobe XD'], true, true, 4.8, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer2@example.com', 'dev_james', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'James Developer', 'FREELANCER', 'Full-stack developer specializing in React and Node.js', 'Toronto, Canada', 95.00, ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB'], true, true, 4.9, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer3@example.com', 'designer_maria', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Maria Graphics', 'FREELANCER', 'Graphic designer and illustrator', 'Barcelona, Spain', 65.00, ARRAY['Graphic Design', 'Illustration', 'Branding', 'Photoshop'], true, true, 4.7, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer4@example.com', 'dev_david', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'David Backend', 'FREELANCER', 'Backend engineer with Java and Python expertise', 'Mumbai, India', 55.00, ARRAY['Java', 'Spring Boot', 'Python', 'PostgreSQL'], true, true, 4.6, 38, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer5@example.com', 'designer_sophie', '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS', 'Sophie Web', 'FREELANCER', 'Web designer and front-end developer', 'Paris, France', 75.00, ARRAY['Web Design', 'HTML/CSS', 'JavaScript', 'Responsive Design'], true, true, 4.8, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- SEED DATA - Test Jobs
-- ============================================================================

INSERT INTO jobs (client_id, title, description, category, required_skills, budget, budget_type, duration, experience_level, status, is_featured, view_count, proposal_count, created_at, updated_at) VALUES
(2, 'Modern Landing Page Design', 'Need a creative landing page design for a SaaS product. Should be modern, clean, and conversion-focused.', 'Web Design', ARRAY['UI Design', 'Figma', 'Responsive Design'], 1500.00, 'FIXED', 14, 'INTERMEDIATE', 'OPEN', true, 23, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Mobile App UI/UX Redesign', 'Complete redesign of our mobile banking app. Need someone with fintech experience.', 'Mobile Design', ARRAY['UI Design', 'UX Design', 'Mobile Design', 'Figma'], 5000.00, 'FIXED', 30, 'EXPERT', 'OPEN', true, 45, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'E-commerce Website Development', 'Build a custom e-commerce site using Next.js and Stripe integration.', 'Web Development', ARRAY['React', 'Next.js', 'TypeScript', 'Stripe API'], 8000.00, 'FIXED', 45, 'EXPERT', 'OPEN', false, 31, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Logo and Brand Identity', 'Need a complete brand identity package including logo, color palette, and brand guidelines.', 'Branding', ARRAY['Graphic Design', 'Branding', 'Illustrator'], 2000.00, 'FIXED', 21, 'INTERMEDIATE', 'OPEN', false, 18, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'REST API Development', 'Build a scalable REST API with authentication, rate limiting, and documentation.', 'Backend Development', ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'REST API'], 6000.00, 'FIXED', 30, 'EXPERT', 'OPEN', false, 27, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Social Media Graphics', 'Create a series of social media graphics for Instagram and Facebook campaigns.', 'Graphic Design', ARRAY['Graphic Design', 'Photoshop', 'Social Media'], 800.00, 'FIXED', 7, 'ENTRY', 'OPEN', false, 15, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'WordPress Site Customization', 'Customize existing WordPress site with new theme and plugins.', 'Web Development', ARRAY['WordPress', 'PHP', 'HTML/CSS'], 1200.00, 'HOURLY', 20, 'INTERMEDIATE', 'OPEN', false, 12, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Product Photography Editing', 'Edit 50 product photos for e-commerce listing. Remove background and color correction.', 'Photo Editing', ARRAY['Photoshop', 'Photo Editing'], 500.00, 'FIXED', 5, 'ENTRY', 'OPEN', false, 9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Marketing Email Templates', 'Design responsive email templates for marketing campaigns.', 'Email Design', ARRAY['HTML/CSS', 'Email Design', 'Responsive Design'], 1000.00, 'FIXED', 10, 'INTERMEDIATE', 'OPEN', false, 14, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'iOS App Development', 'Develop a simple iOS app for recipe sharing with SwiftUI.', 'Mobile Development', ARRAY['Swift', 'SwiftUI', 'iOS Development'], 7000.00, 'FIXED', 60, 'EXPERT', 'OPEN', true, 38, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- SEED DATA - Test Proposals
-- ============================================================================

INSERT INTO proposals (job_id, freelancer_id, cover_letter, proposed_rate, estimated_duration, status, created_at, updated_at) VALUES
(1, 7, 'I have 8+ years of experience in UI/UX design and have created numerous landing pages for SaaS products. I would love to work on your project.', 1400.00, 12, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 9, 'As a graphic designer specializing in web design, I can deliver a modern and conversion-focused landing page. Check out my portfolio!', 1500.00, 14, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 7, 'I have extensive experience in fintech app design. Recently completed a banking app redesign that increased user engagement by 40%.', 4800.00, 28, 'SHORTLISTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 11, 'Senior UI/UX designer with fintech background. I focus on user-centered design and accessibility. Would love to discuss your project.', 5200.00, 30, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 8, 'Full-stack developer with 6+ years React/Next.js experience. I have built several e-commerce platforms with Stripe integration.', 7500.00, 42, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 10, 'Backend engineer who can handle your Next.js and API requirements. Strong experience with Stripe and payment processing.', 7800.00, 45, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 9, 'Graphic designer specializing in brand identity. I will create a unique and memorable brand for your business.', 1900.00, 20, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 10, 'Java expert with Spring Boot and PostgreSQL. I have built numerous scalable REST APIs with proper authentication and documentation.', 5800.00, 28, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 8, 'I can build a robust REST API with best practices. Experience with Spring Security, JWT, and OpenAPI documentation.', 6200.00, 30, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 9, 'Experienced in social media design. I will create eye-catching graphics that drive engagement.', 750.00, 7, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 11, 'WordPress expert with 5+ years experience. I can customize your site and ensure mobile responsiveness.', 1100.00, 18, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 11, 'Web designer with email template expertise. I ensure compatibility across all email clients.', 950.00, 10, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 8, 'Full-stack developer comfortable with iOS development. I have shipped multiple apps to the App Store.', 6800.00, 55, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- SEED DATA - Test Notifications
-- ============================================================================

INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id, is_read) VALUES
(2, 'PROPOSAL_RECEIVED', 'New Proposal Received', 'You have received a new proposal for your job "Modern Landing Page Design"', 'JOB', 1, false),
(7, 'PROPOSAL_ACCEPTED', 'Proposal Accepted', 'Your proposal has been accepted!', 'PROPOSAL', 1, false),
(3, 'JOB_POSTED', 'Job Successfully Posted', 'Your job "Mobile App UI/UX Redesign" has been posted successfully', 'JOB', 2, true),
(8, 'PROPOSAL_RECEIVED', 'New Message', 'Client sent you a message regarding your proposal', 'PROPOSAL', 5, false),
(4, 'JOB_POSTED', 'Job Successfully Posted', 'Your job "E-commerce Website Development" has been posted successfully', 'JOB', 3, true);
