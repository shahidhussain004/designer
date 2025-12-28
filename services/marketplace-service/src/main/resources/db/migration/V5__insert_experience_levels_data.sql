-- Insert experience levels
INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order) VALUES
('Entry Level', 'ENTRY', 'Little to no professional experience required', 0, 2, 1),
('Intermediate', 'INTERMEDIATE', 'Some professional experience required', 2, 5, 2),
('Expert', 'EXPERT', 'Extensive professional experience required', 5, NULL, 3);

-- Update timestamp
UPDATE experience_levels SET updated_at = CURRENT_TIMESTAMP;
