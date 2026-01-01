-- Seed Data: Experience Levels
-- This file seeds the experience_levels table with standard experience levels
-- Idempotent: Uses INSERT ... ON CONFLICT to handle existing data

INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order) VALUES
('Entry Level', 'ENTRY', 'Little to no professional experience required', 0, 2, 1),
('Intermediate', 'INTERMEDIATE', 'Some professional experience required', 2, 5, 2),
('Expert', 'EXPERT', 'Extensive professional experience required', 5, NULL, 3)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  years_min = EXCLUDED.years_min,
  years_max = EXCLUDED.years_max,
  display_order = EXCLUDED.display_order,
  updated_at = CURRENT_TIMESTAMP;
