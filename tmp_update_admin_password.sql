UPDATE users
SET password_hash = '$2y$10$M7o2hh72/arZy0z/wAxuluuha/t/yitUqvoRsLGFTk3qJO6Aw.E2O',
    updated_at = now()
WHERE email = 'admin@designermarket.com';
