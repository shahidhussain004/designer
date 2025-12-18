-- V1__initial_schema.sql
-- Phase 1 Core Marketplace Database Schema
-- This migration matches the existing init.sql schema

-- Note: Tables already exist from init.sql in docker-entrypoint-initdb.d
-- This migration serves as version control for the schema
-- Run with: mvn flyway:migrate

-- Since tables are created by init.sql on first container run,
-- this migration will validate the schema exists
-- Add "CREATE TABLE IF NOT EXISTS" for idempotency

-- Users table (already exists)
CREATE TABLE IF NOT EXISTS users (
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

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Jobs table (already exists)
CREATE TABLE IF NOT EXISTS jobs (
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

CREATE INDEX IF NOT EXISTS idx_jobs_client ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);

-- Proposals table (already exists)
CREATE TABLE IF NOT EXISTS proposals (
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

CREATE INDEX IF NOT EXISTS idx_proposals_job ON proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
