-- =====================================================
-- SEED 08: Administrative Data (Support, Audit, Preferences)
-- Description: Support tickets, audit logs, user preferences, and admin data
-- Dependencies: users
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 8th (After all user activity)
-- =====================================================

-- =====================================================
-- USER PREFERENCES (26 records - 1 per user)
-- =====================================================
INSERT INTO user_preferences (
    user_id, email_notifications, email_weekly_digest, email_marketing,
    notify_project_updates, notify_job_updates, notify_proposal_updates,
    notify_contract_updates, notify_message_received, notify_payment_received,
    notify_rating_received, show_profile_to_public, show_contact_info,
    show_earnings_history, language, timezone, theme, currency,
    created_at, updated_at
)
SELECT 
    u.id AS user_id,
    true AS email_notifications,
    CASE WHEN u.role IN ('COMPANY', 'ADMIN') THEN true ELSE RANDOM() < 0.6 END AS email_weekly_digest,
    CASE WHEN RANDOM() < 0.4 THEN true ELSE false END AS email_marketing,
    CASE WHEN u.role = 'FREELANCER' THEN true ELSE RANDOM() < 0.8 END AS notify_project_updates,
    CASE WHEN u.role = 'FREELANCER' THEN true ELSE RANDOM() < 0.7 END AS notify_job_updates,
    CASE WHEN u.role = 'COMPANY' THEN true ELSE RANDOM() < 0.8 END AS notify_proposal_updates,
    true AS notify_contract_updates,
    true AS notify_message_received,
    true AS notify_payment_received,
    CASE WHEN u.role = 'FREELANCER' THEN true ELSE RANDOM() < 0.7 END AS notify_rating_received,
    CASE WHEN u.role = 'FREELANCER' THEN true ELSE RANDOM() < 0.8 END AS show_profile_to_public,
    CASE WHEN RANDOM() < 0.5 THEN true ELSE false END AS show_contact_info,
    CASE WHEN RANDOM() < 0.3 THEN true ELSE false END AS show_earnings_history,
    'en' AS language,
    CASE 
        WHEN u.location ILIKE '%York%' THEN 'America/New_York'
        WHEN u.location ILIKE '%Chicago%' OR u.location ILIKE '%IL%' THEN 'America/Chicago'
        WHEN u.location ILIKE '%Los Angeles%' OR u.location ILIKE '%San Francisco%' THEN 'America/Los_Angeles'
        ELSE 'America/New_York'
    END AS timezone,
    CASE (RANDOM() * 2)::INT
        WHEN 0 THEN 'light'
        WHEN 1 THEN 'dark'
        ELSE 'auto'
    END AS theme,
    'USD' AS currency,
    u.created_at + INTERVAL '1 hour' AS created_at,
    u.created_at + INTERVAL '2 hours' AS updated_at
FROM users u
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- SUPPORT TICKETS (15 records - various issues)
-- =====================================================
INSERT INTO support_tickets (
    ticket_number, title, description, reported_by, assigned_to,
    category, priority, status, related_entity_type, related_entity_id,
    resolution_notes, resolution_time, feedback_rating, feedback_comment,
    created_at, updated_at, closed_at
)
SELECT 
    'TICKET-' || TO_CHAR(NOW() - ((ticket_data.days_ago)::TEXT || ' days')::INTERVAL, 'YYYYMMDD') || '-' || LPAD((ROW_NUMBER() OVER ())::TEXT, 4, '0') AS ticket_number,
    ticket_data.title AS title,
    ticket_data.description AS description,
    u.id AS reported_by,
    (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1) AS assigned_to,
    ticket_data.category AS category,
    ticket_data.priority AS priority,
    ticket_data.status AS status,
    ticket_data.related_entity_type AS related_entity_type,
    CASE WHEN ticket_data.related_entity_type IS NOT NULL THEN (SELECT id FROM payments LIMIT 1)::BIGINT ELSE NULL END AS related_entity_id,
    CASE WHEN ticket_data.status IN ('RESOLVED', 'CLOSED') THEN ticket_data.resolution_notes ELSE NULL END AS resolution_notes,
    CASE WHEN ticket_data.status IN ('RESOLVED', 'CLOSED') THEN NOW() - ((ticket_data.days_ago - 2)::TEXT || ' days')::INTERVAL ELSE NULL END AS resolution_time,
    CASE WHEN ticket_data.status = 'CLOSED' THEN ticket_data.feedback_rating ELSE NULL END AS feedback_rating,
    CASE WHEN ticket_data.status = 'CLOSED' THEN ticket_data.feedback_comment ELSE NULL END AS feedback_comment,
    NOW() - ((ticket_data.days_ago)::TEXT || ' days')::INTERVAL AS created_at,
    NOW() - ((ticket_data.days_ago - 1)::TEXT || ' days')::INTERVAL AS updated_at,
    CASE WHEN ticket_data.status = 'CLOSED' THEN NOW() - ((ticket_data.days_ago - 2)::TEXT || ' days')::INTERVAL ELSE NULL END AS closed_at
FROM users u
CROSS JOIN LATERAL (VALUES
    ('Payment Not Received', 'I completed a milestone 5 days ago but have not received funds.', 'Payment', 'HIGH', 'RESOLVED', 'PAYMENT', 'Payment was successfully processed.', 5, 'Thank you for resolving!', 7),
    ('Cannot Upload Portfolio Images', 'Getting upload failed error despite small file size.', 'Technical', 'MEDIUM', 'CLOSED', 'PORTFOLIO', 'Fixed server-side image processing issue.', 4, 'Issue resolved.', 12),
    ('Profile Not Showing in Search', 'Profile not appearing in search results.', 'Account', 'HIGH', 'RESOLVED', 'PROFILE', 'Changed visibility to public.', 5, 'Perfect!', 5),
    ('Client Not Responding', 'Client has not responded for 2 weeks, project is stalled.', 'Dispute', 'HIGH', 'IN_PROGRESS', NULL, NULL, NULL, NULL, 3),
    ('Request: Export Time Entries', 'Would like CSV export for time entries.', 'Feature Request', 'LOW', 'OPEN', NULL, NULL, NULL, NULL, 15),
    ('Proposal Submission Error', 'Validation error on proposal submission.', 'Technical', 'MEDIUM', 'RESOLVED', 'PROPOSAL', 'Fixed validation bug.', 4, 'Working now!', 8),
    ('Escrow Release Delayed', 'Milestone approved but escrow not released.', 'Payment', 'URGENT', 'RESOLVED', 'ESCROW', 'Manually triggered release.', 5, 'Resolved quickly!', 4),
    ('Cannot Update Hourly Rate', 'Invalid rate format error.', 'Account', 'MEDIUM', 'CLOSED', 'PROFILE', 'Fixed validation regex.', 5, 'All good!', 9),
    ('Milestone Payment Wrong', 'Milestone amounts incorrect in calculation.', 'Contract', 'HIGH', 'RESOLVED', 'CONTRACT', 'Recalculated amounts.', 4, 'Thank you!', 6),
    ('Video Call Not Working', 'Video consultation failing to start.', 'Technical', 'HIGH', 'WAITING_USER', NULL, NULL, NULL, NULL, 2),
    ('How to Verify Identity', 'Document requirements for identity verification.', 'General', 'LOW', 'CLOSED', NULL, 'Provided verification instructions.', 5, 'Very helpful!', 10),
    ('Search Filters Not Working', 'Experience level filter not applying.', 'Technical', 'MEDIUM', 'RESOLVED', NULL, 'Fixed search query bug.', 4, 'Working now.', 11),
    ('Add Calendar Integration', 'Request for Google Calendar sync.', 'Feature Request', 'LOW', 'OPEN', NULL, NULL, NULL, NULL, 20),
    ('Platform Fee Question', 'Clarification on fee percentage.', 'General', 'MEDIUM', 'RESOLVED', 'INVOICE', 'Explained fee structure.', 5, 'Thanks!', 7),
    ('Suspicious Login', 'Unrecognized IP login attempt.', 'Security', 'URGENT', 'CLOSED', NULL, 'No unauthorized access. 2FA enabled.', 5, 'Glad it was safe!', 3)
) AS ticket_data (title, description, category, priority, status, related_entity_type, resolution_notes, feedback_rating, feedback_comment, days_ago)
WHERE u.role IN ('FREELANCER', 'COMPANY')
LIMIT 15
ON CONFLICT (ticket_number) DO NOTHING;

-- =====================================================
-- SUPPORT TICKET REPLIES (30 records - ticket conversations)
-- =====================================================
INSERT INTO support_ticket_replies (
    ticket_id, author_id, message, is_internal, created_at, updated_at
)
SELECT 
    st.id AS ticket_id,
    CASE WHEN reply_data.is_admin THEN st.assigned_to ELSE st.reported_by END AS author_id,
    reply_data.message AS message,
    reply_data.is_internal AS is_internal,
    st.created_at + ((reply_data.hours_offset)::TEXT || ' hours')::INTERVAL AS created_at,
    st.created_at + ((reply_data.hours_offset + 1)::TEXT || ' hours')::INTERVAL AS updated_at
FROM support_tickets st
CROSS JOIN LATERAL (VALUES
    (true, 'Thank you for contacting support. I am looking into this issue and will update you shortly.', false, 2),
    (false, 'I checked the payment details and it shows it was processed on [date]. Can you confirm your bank account details are correct?', true, 6),
    (false, 'Yes, my bank account details are correct in my profile. The payment is still not showing in my account.', false, 8),
    (true, 'I have escalated this to our payment processing team. They will investigate and resolve within 24 hours.', false, 10),
    (false, 'Update: The payment has been reprocessed and you should receive it within 1-2 business days.', true, 48),
    (false, 'I received the payment today. Thank you for your help!', false, 72)
) AS reply_data (is_admin, message, is_internal, hours_offset)
WHERE st.status IN ('RESOLVED', 'CLOSED', 'IN_PROGRESS')
LIMIT 30
ON CONFLICT DO NOTHING;

-- =====================================================
-- AUDIT LOGS (50 records - user activity)
-- =====================================================
INSERT INTO audit_logs (
    user_id, action, entity_type, entity_id, old_values, new_values,
    changes, ip_address, user_agent, endpoint, http_method, status_code,
    created_at
)
SELECT 
    u.id AS user_id,
    audit_data.action AS action,
    audit_data.entity_type AS entity_type,
    (SELECT id FROM contracts LIMIT 1)::BIGINT AS entity_id,
    audit_data.old_values::jsonb AS old_values,
    audit_data.new_values::jsonb AS new_values,
    audit_data.changes::jsonb AS changes,
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN '192.168.1.' || (100 + (RANDOM() * 50)::INT)::TEXT
        WHEN 1 THEN '10.0.0.' || (10 + (RANDOM() * 30)::INT)::TEXT
        ELSE '172.16.0.' || (20 + (RANDOM() * 40)::INT)::TEXT
    END AS ip_address,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' AS user_agent,
    audit_data.endpoint AS endpoint,
    audit_data.http_method AS http_method,
    200 AS status_code,
    NOW() - ((audit_data.days_ago)::TEXT || ' days')::INTERVAL AS created_at
FROM users u
CROSS JOIN LATERAL (VALUES
    ('USER_LOGIN', 'USER', NULL, NULL, NULL, '/api/auth/login', 'POST', 1),
    ('PROFILE_UPDATE', 'USER', '{"bio": "Old"}', '{"bio": "Updated"}', '{"bio": ["Old", "Updated"]}', '/api/users/profile', 'PUT', 3),
    ('PROJECT_CREATE', 'PROJECT', NULL, '{"title": "New"}', '{"title": ["", "New"]}', '/api/projects', 'POST', 5),
    ('CONTRACT_UPDATE', 'CONTRACT', '{"status": "PENDING"}', '{"status": "ACTIVE"}', '{"status": ["PENDING", "ACTIVE"]}', '/api/contracts', 'PUT', 7),
    ('PAYMENT_PROCESS', 'PAYMENT', NULL, '{"status": "COMPLETED"}', '{"status": ["PROCESSING", "COMPLETED"]}', '/api/payments', 'POST', 10),
    ('REVIEW_CREATE', 'REVIEW', NULL, '{"rating": 5.0}', '{"rating": ["", 5.0]}', '/api/reviews', 'POST', 15),
    ('MESSAGE_SEND', 'MESSAGE', NULL, '{"body": "Message"}', NULL, '/api/messages', 'POST', 2),
    ('PROPOSAL_SUBMIT', 'PROPOSAL', NULL, '{"status": "SUBMITTED"}', '{"status": ["DRAFT", "SUBMITTED"]}', '/api/proposals', 'POST', 8),
    ('USER_LOGOUT', 'USER', NULL, NULL, NULL, '/api/auth/logout', 'POST', 1),
    ('PORTFOLIO_UPDATE', 'PORTFOLIO', '{"title": "Old"}', '{"title": "Updated"}', '{"title": ["Old", "Updated"]}', '/api/portfolio', 'PUT', 12)
) AS audit_data (action, entity_type, old_values, new_values, changes, endpoint, http_method, days_ago)
WHERE u.role IN ('FREELANCER', 'COMPANY')
LIMIT 50
ON CONFLICT DO NOTHING;

-- =====================================================
-- BLOCKLIST (5 records - blocked users)
-- =====================================================
INSERT INTO blocklist (
    blocker_id, blocked_user_id, reason, created_at
)
SELECT 
    u1.id AS blocker_id,
    u2.id AS blocked_user_id,
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN 'Unprofessional behavior'
        WHEN 1 THEN 'Failed to deliver on previous project'
        ELSE 'Poor communication'
    END AS reason,
    NOW() - ((RANDOM() * 60)::INT || ' days')::INTERVAL AS created_at
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id
AND u1.role IN ('COMPANY', 'FREELANCER')
AND u2.role IN ('COMPANY', 'FREELANCER')
AND u1.role != u2.role
AND RANDOM() < 0.02  -- Only 2% chance to create blocklist entry
LIMIT 5
ON CONFLICT (blocker_id, blocked_user_id) DO NOTHING;

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Administrative data loaded: % user preferences, % support tickets (% replies), % audit logs, % blocklist entries',
        (SELECT COUNT(*) FROM user_preferences),
        (SELECT COUNT(*) FROM support_tickets),
        (SELECT COUNT(*) FROM support_ticket_replies),
        (SELECT COUNT(*) FROM audit_logs),
        (SELECT COUNT(*) FROM blocklist);
    RAISE NOTICE 'Support ticket status: % open, % in progress, % resolved, % closed',
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'OPEN'),
        (SELECT COUNT(*) FROM support_tickets WHERE status IN ('IN_PROGRESS', 'WAITING_USER')),
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'RESOLVED'),
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'CLOSED');
END $$;
