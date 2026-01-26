-- =====================================================
-- SEED 07: Messaging & Notifications
-- Description: Message threads, messages, notifications, and communication data
-- Dependencies: users, projects, jobs, contracts
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 7th (After contracts, projects, reviews)
-- =====================================================

-- =====================================================
-- MESSAGE THREADS (20 records - user conversations)
-- =====================================================
INSERT INTO message_threads (
    user_id_1, user_id_2, project_id, contract_id, job_id,
    subject, is_archived, unread_count_user1, unread_count_user2,
    last_message_at, created_at, updated_at
)
SELECT 
    LEAST(comp.user_id, f.user_id) AS user_id_1,
    GREATEST(comp.user_id, f.user_id) AS user_id_2,
    c.project_id,
    c.id AS contract_id,
    NULL::BIGINT AS job_id,
    'Project Discussion: ' || p.title AS subject,
    false AS is_archived,
    CASE WHEN RANDOM() < 0.3 THEN (RANDOM() * 3)::INT ELSE 0 END AS unread_count_user1,
    CASE WHEN RANDOM() < 0.3 THEN (RANDOM() * 2)::INT ELSE 0 END AS unread_count_user2,
    c.created_at + ((RANDOM() * 20)::INT || ' days')::INTERVAL AS last_message_at,
    c.created_at + INTERVAL '1 hour' AS created_at,
    c.created_at + ((RANDOM() * 20)::INT || ' days')::INTERVAL AS updated_at
FROM contracts c
JOIN projects p ON c.project_id = p.id
JOIN companies comp ON c.company_id = comp.id
JOIN freelancers f ON c.freelancer_id = f.id
WHERE c.status IN ('ACTIVE', 'COMPLETED')
LIMIT 20
ON CONFLICT (user_id_1, user_id_2, project_id, job_id, contract_id) DO NOTHING;

-- =====================================================
-- MESSAGES (80 records - conversation history)
-- =====================================================
INSERT INTO messages (
    thread_id, sender_id, body, is_read, read_at,
    created_at, updated_at
)
SELECT 
    mt.id AS thread_id,
    CASE WHEN message_data.sender_index = 1 THEN mt.user_id_1 ELSE mt.user_id_2 END AS sender_id,
    message_data.body AS body,
    CASE WHEN RANDOM() < 0.7 THEN true ELSE false END AS is_read,
    CASE WHEN RANDOM() < 0.7 THEN mt.created_at + ((message_data.msg_index + 1)::TEXT || ' hours')::INTERVAL ELSE NULL END AS read_at,
    mt.created_at + ((message_data.msg_index)::TEXT || ' hours')::INTERVAL AS created_at,
    mt.created_at + ((message_data.msg_index)::TEXT || ' hours')::INTERVAL AS updated_at
FROM message_threads mt
CROSS JOIN LATERAL (VALUES
    (1, 1, 'Hi! I reviewed your proposal and I''m impressed with your experience. I''d like to discuss the project requirements in more detail.'),
    (2, 2, 'Thank you! I''m excited about this opportunity. I have a few questions about the timeline and specific technologies you prefer.'),
    (3, 1, 'Sure! We''re flexible with the timeline as long as quality is maintained. We prefer React for frontend and Node.js for backend.'),
    (4, 2, 'Perfect! I have extensive experience with that stack. When would you like to start the project?'),
    (5, 1, 'We can start next week. I''ll send over the detailed requirements document and design mockups.'),
    (6, 2, 'Sounds great! I''ll review the documents and prepare a detailed project plan with milestones.'),
    (7, 1, 'Excellent. Looking forward to working with you!'),
    (8, 2, 'I''ve completed the first milestone. Could you please review and provide feedback?'),
    (9, 1, 'I reviewed the work - it looks great! I''ve approved the milestone and payment is processing.'),
    (10, 2, 'Thank you! I''ll proceed with the next milestone as planned.')
) AS message_data (msg_index, sender_index, body)
LIMIT 80
ON CONFLICT DO NOTHING;

-- Update last_message_at on threads
UPDATE message_threads mt
SET last_message_at = (
    SELECT MAX(created_at) FROM messages WHERE thread_id = mt.id
)
WHERE id IN (SELECT DISTINCT thread_id FROM messages);

-- =====================================================
-- NOTIFICATIONS (50 records - user notifications)
-- =====================================================
-- Contract notifications
INSERT INTO notifications (
    user_id, type, title, message, related_entity_type, related_entity_id,
    action_url, is_read, read_at, priority, created_at
)
SELECT 
    (SELECT user_id FROM freelancers WHERE id = c.freelancer_id) AS user_id,
    'CONTRACT_CREATED' AS type,
    'New Contract Created' AS title,
    'A new contract has been created for project: ' || p.title AS message,
    'CONTRACT' AS related_entity_type,
    c.id AS related_entity_id,
    '/contracts/' || c.id AS action_url,
    CASE WHEN RANDOM() < 0.7 THEN true ELSE false END AS is_read,
    CASE WHEN RANDOM() < 0.7 THEN c.created_at + INTERVAL '2 hours' ELSE NULL END AS read_at,
    'HIGH' AS priority,
    c.created_at AS created_at
FROM contracts c
JOIN projects p ON c.project_id = p.id
ON CONFLICT DO NOTHING;

-- Payment notifications
INSERT INTO notifications (
    user_id, type, title, message, related_entity_type, related_entity_id,
    action_url, is_read, read_at, priority, created_at
)
SELECT 
    (SELECT user_id FROM freelancers WHERE id = p.payee_id) AS user_id,
    'PAYMENT_RECEIVED' AS type,
    'Payment Received' AS title,
    'You have received a payment of $' || (p.amount_cents / 100.0)::TEXT || ' for ' || p.description AS message,
    'PAYMENT' AS related_entity_type,
    p.id AS related_entity_id,
    '/payments/' || p.id AS action_url,
    CASE WHEN RANDOM() < 0.8 THEN true ELSE false END AS is_read,
    CASE WHEN RANDOM() < 0.8 THEN p.created_at + INTERVAL '1 hour' ELSE NULL END AS read_at,
    'HIGH' AS priority,
    p.created_at AS created_at
FROM payments p
WHERE p.status = 'COMPLETED'
ON CONFLICT DO NOTHING;

-- Proposal notifications
INSERT INTO notifications (
    user_id, type, title, message, related_entity_type, related_entity_id,
    action_url, is_read, read_at, priority, created_at
)
SELECT 
    comp.user_id AS user_id,
    'PROPOSAL_RECEIVED' AS type,
    'New Proposal Received' AS title,
    'You have received a new proposal for: ' || proj.title AS message,
    'PROPOSAL' AS related_entity_type,
    prop.id AS related_entity_id,
    '/proposals/' || prop.id AS action_url,
    CASE WHEN RANDOM() < 0.6 THEN true ELSE false END AS is_read,
    CASE WHEN RANDOM() < 0.6 THEN prop.created_at + INTERVAL '3 hours' ELSE NULL END AS read_at,
    'MEDIUM' AS priority,
    prop.created_at AS created_at
FROM proposals prop
JOIN projects proj ON prop.project_id = proj.id
JOIN companies comp ON proj.company_id = comp.id
ON CONFLICT DO NOTHING;

-- Review notifications
INSERT INTO notifications (
    user_id, type, title, message, related_entity_type, related_entity_id,
    action_url, is_read, read_at, priority, created_at
)
SELECT 
    r.reviewed_user_id AS user_id,
    'REVIEW_RECEIVED' AS type,
    'New Review Received' AS title,
    'You have received a ' || r.rating || '-star review: ' || r.title AS message,
    'REVIEW' AS related_entity_type,
    r.id AS related_entity_id,
    '/reviews/' || r.id AS action_url,
    CASE WHEN RANDOM() < 0.9 THEN true ELSE false END AS is_read,
    CASE WHEN RANDOM() < 0.9 THEN r.created_at + INTERVAL '30 minutes' ELSE NULL END AS read_at,
    'MEDIUM' AS priority,
    r.created_at AS created_at
FROM reviews r
ON CONFLICT DO NOTHING;

-- Message notifications
INSERT INTO notifications (
    user_id, type, title, message, related_entity_type, related_entity_id,
    action_url, is_read, priority, created_at
)
SELECT 
    CASE WHEN m.sender_id = mt.user_id_1 THEN mt.user_id_2 ELSE mt.user_id_1 END AS user_id,
    'MESSAGE_RECEIVED' AS type,
    'New Message' AS title,
    'You have a new message: ' || SUBSTRING(m.body, 1, 100) AS message,
    'MESSAGE' AS related_entity_type,
    m.id AS related_entity_id,
    '/messages/' || mt.id AS action_url,
    m.is_read AS is_read,
    'LOW' AS priority,
    m.created_at AS created_at
FROM messages m
JOIN message_threads mt ON m.thread_id = mt.id
WHERE m.body IS NOT NULL AND LENGTH(m.body) > 10
LIMIT 20
ON CONFLICT DO NOTHING;

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Communication data loaded: % message threads, % messages, % notifications',
        (SELECT COUNT(*) FROM message_threads),
        (SELECT COUNT(*) FROM messages),
        (SELECT COUNT(*) FROM notifications);
    RAISE NOTICE 'Notification breakdown: % contract, % payment, % proposal, % review, % message',
        (SELECT COUNT(*) FROM notifications WHERE type = 'CONTRACT_CREATED'),
        (SELECT COUNT(*) FROM notifications WHERE type = 'PAYMENT_RECEIVED'),
        (SELECT COUNT(*) FROM notifications WHERE type = 'PROPOSAL_RECEIVED'),
        (SELECT COUNT(*) FROM notifications WHERE type = 'REVIEW_RECEIVED'),
        (SELECT COUNT(*) FROM notifications WHERE type = 'MESSAGE_RECEIVED');
END $$;
