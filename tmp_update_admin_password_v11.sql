UPDATE users
SET password_hash = '$2y$10$rKX4ukZIMxLa4BHhS7OhUe2oxvS7adYgtXaIWhMgTUlvZAvd39QOq',
    updated_at = now()
WHERE email = 'admin@designermarket.com';
