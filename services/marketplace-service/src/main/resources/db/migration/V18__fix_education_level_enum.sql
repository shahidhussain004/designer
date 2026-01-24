-- V18: Fix Education Level Enum Values
-- Fix bad education_level values in existing jobs data

UPDATE jobs 
SET education_level = 'BACHELOR' 
WHERE education_level = 'Bachelors' OR education_level LIKE '%Bachelor%';

UPDATE jobs 
SET education_level = 'MASTER' 
WHERE education_level = 'Masters' OR education_level LIKE '%Master%';

UPDATE jobs 
SET education_level = 'PHD' 
WHERE education_level = 'Doctorate' OR education_level LIKE '%PhD%' OR education_level LIKE '%Doctorate%';

-- Verify the changes
SELECT COUNT(*) as total_jobs, COUNT(DISTINCT education_level) as unique_levels FROM jobs;
