# Database Schema Summary

## Overview
This document contains the exact schema for 8 key tables in the marketplace database, including column definitions, constraints, and valid status values.

---

## 1. PROPOSALS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| project_id | bigint | NO | Foreign key to projects |
| freelancer_id | bigint | NO | Foreign key to users |
| cover_letter | text | NO | Required proposal text |
| suggested_budget_cents | bigint | YES | Budget in cents (≥0 if provided) |
| proposed_timeline | varchar | YES | Timeline estimate |
| estimated_hours | numeric | YES | Hours estimate (>0 if provided) |
| attachments | ARRAY | YES | Array of attachment URLs |
| portfolio_links | ARRAY | YES | Array of portfolio URLs |
| answers | jsonb | YES | JSON answers to project questions |
| status | varchar | NO | **See Status Values** |
| is_featured | boolean | YES | Featured proposal flag |
| company_notes | text | YES | Internal company notes |
| rejection_reason | text | YES | Reason if rejected |
| company_rating | numeric | YES | Company rating (0-5) |
| company_review | text | YES | Company review text |
| freelancer_rating | numeric | YES | Freelancer rating (0-5) |
| freelancer_review | text | YES | Freelancer review text |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |
| reviewed_at | timestamp | YES | When proposal was reviewed |

### Status Values
- `SUBMITTED` - Initial submission state
- `REVIEWING` - Company is reviewing
- `SHORTLISTED` - Moved to shortlist
- `ACCEPTED` - Proposal accepted
- `REJECTED` - Proposal rejected
- `WITHDRAWN` - Freelancer withdrew

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: project_id → projects.id
- FOREIGN KEY: freelancer_id → users.id
- UNIQUE: (project_id, freelancer_id) - one proposal per freelancer per project
- CHECK: suggested_budget_cents ≥ 0 (if not null)
- CHECK: estimated_hours > 0 (if not null)
- CHECK: company_rating between 0-5 (if not null)
- CHECK: freelancer_rating between 0-5 (if not null)

---

## 2. MILESTONES Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| project_id | bigint | NO | Foreign key to projects |
| contract_id | bigint | YES | Foreign key to contracts |
| title | varchar | NO | Milestone title |
| description | text | YES | Detailed description |
| deliverables | jsonb | NO | JSON array of deliverables |
| amount_cents | bigint | NO | Milestone amount (>0) |
| currency | varchar | NO | Currency code |
| due_date | date | NO | Required due date |
| start_date | date | YES | Optional start date |
| completed_at | timestamp | YES | When marked complete |
| status | varchar | NO | **See Status Values** |
| order_number | integer | NO | Order in sequence (>0) |
| company_notes | text | YES | Company notes |
| freelancer_notes | text | YES | Freelancer notes |
| approval_date | timestamp | YES | When approved (required if APPROVED) |
| rejection_reason | text | YES | Reason if rejected |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |

### Status Values
- `PENDING` - Not started
- `IN_PROGRESS` - Currently active
- `SUBMITTED` - Freelancer submitted for review
- `APPROVED` - Approved by company (approval_date required)
- `REJECTED` - Rejected by company
- `CANCELLED` - Milestone cancelled

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: project_id → projects.id
- FOREIGN KEY: contract_id → contracts.id (if applicable)
- CHECK: amount_cents > 0
- CHECK: order_number > 0
- CHECK: due_date ≥ start_date (if both provided)
- CHECK: If status = APPROVED, then approval_date must be NOT NULL

---

## 3. INVOICES Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| project_id | bigint | NO | Foreign key to projects |
| contract_id | bigint | YES | Foreign key to contracts |
| milestone_id | bigint | YES | Foreign key to milestones |
| company_id | bigint | NO | Billing company |
| freelancer_id | bigint | NO | Receiving freelancer |
| payment_id | bigint | YES | Foreign key to payments |
| invoice_number | varchar | NO | Unique invoice number |
| invoice_type | varchar | NO | **See Invoice Type Values** |
| invoice_date | timestamp | NO | Invoice issue date |
| due_date | timestamp | YES | Payment due date |
| paid_at | timestamp | YES | Payment completion timestamp |
| subtotal_cents | bigint | NO | Subtotal (≥0) |
| tax_amount_cents | bigint | NO | Tax amount (≥0) |
| platform_fee_cents | bigint | NO | Platform fee (≥0) |
| total_cents | bigint | NO | Total = subtotal + tax + fee |
| currency | varchar | NO | Currency code |
| line_items | jsonb | NO | JSON array of line items |
| company_billing_info | jsonb | YES | Company billing details |
| freelancer_billing_info | jsonb | YES | Freelancer billing details |
| notes | text | YES | Additional notes |
| pdf_url | text | YES | PDF URL |
| status | varchar | NO | **See Status Values** |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |

### Invoice Type Values
- `PAYMENT` - Regular payment invoice
- `MILESTONE` - Milestone-based payment
- `REFUND` - Refund invoice
- `PAYOUT` - Payout invoice

### Status Values
- `DRAFT` - Work in progress
- `SENT` - Sent to client
- `PAID` - Payment received (paid_at required)
- `OVERDUE` - Past due date
- `CANCELLED` - Invoice cancelled
- `REFUNDED` - Refunded

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: project_id → projects.id
- FOREIGN KEY: company_id → companies.id
- FOREIGN KEY: freelancer_id → users.id
- FOREIGN KEY: contract_id → contracts.id (if provided)
- UNIQUE: invoice_number
- CHECK: subtotal_cents ≥ 0 AND tax_amount_cents ≥ 0 AND platform_fee_cents ≥ 0
- CHECK: total_cents = subtotal_cents + tax_amount_cents + platform_fee_cents
- CHECK: due_date ≥ invoice_date (if due_date provided)
- CHECK: If status = PAID, then paid_at must be NOT NULL

---

## 4. PAYMENTS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| contract_id | bigint | YES | Foreign key to contracts |
| payer_id | bigint | NO | Foreign key to users (paying user) |
| payee_id | bigint | NO | Foreign key to users (receiving user) |
| amount_cents | bigint | NO | Amount (>0) |
| currency | varchar | NO | Currency code |
| payment_method | varchar | YES | **See Payment Method Values** |
| description | text | YES | Payment description |
| status | varchar | NO | **See Status Values** |
| transaction_id | varchar | YES | External transaction ID |
| reference_number | varchar | YES | Payment reference |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |
| processed_at | timestamp | YES | When processed |

### Payment Method Values
- `CREDIT_CARD` - Credit/debit card
- `BANK_TRANSFER` - Bank transfer
- `WALLET` - Platform wallet
- `PAYPAL` - PayPal

### Status Values
- `PENDING` - Awaiting processing
- `PROCESSING` - Currently being processed
- `COMPLETED` - Successfully completed
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: payer_id → users.id
- FOREIGN KEY: payee_id → users.id
- FOREIGN KEY: contract_id → contracts.id (if provided)
- CHECK: amount_cents > 0
- CHECK: payment_method in (CREDIT_CARD, BANK_TRANSFER, WALLET, PAYPAL) if not null

---

## 5. PAYOUTS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| user_id | bigint | NO | Foreign key to users |
| amount_cents | bigint | NO | Payout amount (>0) |
| currency | varchar | NO | Currency code |
| payout_method | varchar | YES | **See Payout Method Values** |
| status | varchar | NO | **See Status Values** |
| payout_account | varchar | YES | Account identifier |
| period_start | date | YES | Period start date |
| period_end | date | YES | Period end date |
| transaction_id | varchar | YES | External transaction ID |
| notes | text | YES | Notes |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |
| processed_at | timestamp | YES | When processed |

### Payout Method Values
- `BANK_TRANSFER` - Direct bank transfer
- `PAYPAL` - PayPal transfer
- `WISE` - Wise.com transfer
- `CRYPTO` - Cryptocurrency transfer

### Status Values
- `PENDING` - Awaiting processing
- `PROCESSING` - Currently being processed
- `COMPLETED` - Successfully completed
- `FAILED` - Payout failed
- `CANCELLED` - Payout cancelled

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users.id
- CHECK: amount_cents > 0
- CHECK: payout_method in (BANK_TRANSFER, PAYPAL, WISE, CRYPTO) if not null
- CHECK: period_end ≥ period_start (if both provided)

---

## 6. REVIEWS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| reviewer_id | bigint | NO | Foreign key to users (reviewer) |
| reviewed_user_id | bigint | NO | Foreign key to users (reviewed) |
| contract_id | bigint | YES | Foreign key to contracts |
| project_id | bigint | YES | Foreign key to projects |
| rating | numeric | NO | Rating (0-5) |
| title | varchar | YES | Review title |
| comment | text | YES | Review comment |
| categories | jsonb | YES | JSON rating categories |
| status | varchar | NO | **See Status Values** |
| is_verified_purchase | boolean | YES | Verified purchase flag |
| helpful_count | integer | NO | Helpful votes (≥0) |
| unhelpful_count | integer | NO | Unhelpful votes (≥0) |
| response_comment | text | YES | Response to review |
| response_at | timestamp | YES | Response timestamp |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |

### Status Values
- `DRAFT` - Work in progress
- `PUBLISHED` - Visible to public
- `FLAGGED` - Flagged for review
- `REMOVED` - Removed from platform

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: reviewer_id → users.id
- FOREIGN KEY: reviewed_user_id → users.id
- FOREIGN KEY: contract_id → contracts.id (if provided)
- FOREIGN KEY: project_id → projects.id (if provided)
- UNIQUE: (contract_id, reviewer_id) - one review per reviewer per contract (if contract provided)
- CHECK: reviewer_id ≠ reviewed_user_id
- CHECK: rating between 0-5
- CHECK: helpful_count ≥ 0 AND unhelpful_count ≥ 0

---

## 7. PORTFOLIO_ITEMS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| user_id | bigint | NO | Foreign key to users |
| title | varchar | NO | Project title |
| description | text | YES | Detailed description |
| image_url | text | YES | Primary image URL |
| thumbnail_url | text | YES | Thumbnail URL |
| images | jsonb | NO | JSON array of image URLs |
| project_url | text | YES | Project URL |
| github_url | text | YES | GitHub repository URL |
| live_url | text | YES | Live demo URL |
| source_url | text | YES | Source code URL |
| skills_demonstrated | jsonb | NO | JSON array of skills |
| tools_used | jsonb | NO | JSON array of tools |
| technologies | jsonb | NO | JSON array of technologies |
| project_category | varchar | YES | Project category |
| start_date | date | YES | Project start date |
| end_date | date | YES | Project end date |
| display_order | integer | NO | Display order (≥0) |
| highlight_order | integer | YES | Highlight order (if featured) |
| is_visible | boolean | NO | Visibility flag |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |
| deleted_at | timestamp | YES | Soft delete timestamp |

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: user_id → users.id
- CHECK: display_order ≥ 0
- CHECK: end_date ≥ start_date (if both provided)

---

## 8. JOB_APPLICATIONS Table

### Columns
| Column Name | Data Type | Nullable | Notes |
|---|---|---|---|
| id | bigint | NO | Primary key |
| job_id | bigint | NO | Foreign key to jobs |
| applicant_id | bigint | NO | Foreign key to users |
| full_name | varchar | NO | Full name |
| email | varchar | NO | Email address |
| phone | varchar | YES | Phone number |
| cover_letter | text | YES | Application cover letter |
| resume_url | text | YES | Resume URL |
| portfolio_url | text | YES | Portfolio URL |
| linkedin_url | text | YES | LinkedIn profile URL |
| additional_documents | ARRAY | YES | Array of document URLs |
| answers | jsonb | YES | JSON answers to job questions |
| status | varchar | NO | **See Status Values** |
| company_notes | text | YES | Company internal notes |
| rejection_reason | text | YES | Reason for rejection |
| reviewed_at | timestamp | YES | When reviewed |
| applied_at | timestamp | YES | Application submission time |
| created_at | timestamp | NO | Creation timestamp |
| updated_at | timestamp | NO | Last update timestamp |
| deleted_at | timestamp | YES | Soft delete timestamp |

### Status Values
- `PENDING` - Initial state
- `SUBMITTED` - Formally submitted
- `REVIEWING` - Company reviewing
- `SHORTLISTED` - Moved to shortlist
- `INTERVIEWING` - Interview stage
- `OFFERED` - Job offer extended
- `ACCEPTED` - Offer accepted
- `REJECTED` - Application rejected
- `WITHDRAWN` - Applicant withdrew

### Constraints
- PRIMARY KEY: id
- FOREIGN KEY: job_id → jobs.id
- FOREIGN KEY: applicant_id → users.id

---

## Key Notes

### Data Types
- **bigint**: 64-bit integer, used for IDs and amounts in cents
- **varchar**: Variable-length string
- **text**: Large text content
- **numeric**: Decimal numbers (for ratings, percentages)
- **jsonb**: Binary JSON for structured data
- **date**: Date without time
- **timestamp**: Date and time
- **ARRAY**: PostgreSQL array type
- **boolean**: True/false

### Financial Fields
- All monetary amounts are stored in **cents** (multiply by 100 for currency values)
- Always include **currency** field with amount
- Check constraints ensure non-negative values

### Status Fields
- All status fields use **varchar** with CHECK constraints
- Only specific values are allowed per the constraints above
- Use exact case when inserting (e.g., 'PENDING', not 'pending')

### Date/Time Fields
- `created_at`, `updated_at` are standard audit fields
- Soft deletes use `deleted_at` (nullable timestamp)
- Specific fields like `paid_at`, `processed_at` indicate completion states
- Some date validation exists (end_date ≥ start_date)

### Foreign Keys
- Links to `users`, `projects`, `contracts`, `companies`, `jobs` tables
- All foreign keys are indexed for performance
- Some foreign keys are optional (nullable)

### Unique Constraints
- `invoices.invoice_number` - Globally unique invoice identifiers
- `proposals.(project_id, freelancer_id)` - One proposal per freelancer per project
- `reviews.(contract_id, reviewer_id)` - One review per reviewer per contract (if applicable)
