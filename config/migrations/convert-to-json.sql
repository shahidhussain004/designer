-- Convert text array columns to JSON format
-- This script converts comma-separated text values to JSON arrays

-- Update users.skills
WITH skill_data AS (
  SELECT id, json_agg(trim(x)) as skills_json
  FROM users, LATERAL unnest(string_to_array(skills, ',')) x
  WHERE skills NOT IN ('[]', '', NULL)
  GROUP BY id
)
UPDATE users u SET skills = sd.skills_json::text
FROM skill_data sd
WHERE u.id = sd.id;

-- Set empty skills to JSON array
UPDATE users SET skills = '[]'::text WHERE skills IN ('[]', '', NULL);

-- Update users.languages
WITH lang_data AS (
  SELECT id, json_agg(trim(x)) as langs_json
  FROM users, LATERAL unnest(string_to_array(languages, ',')) x
  WHERE languages NOT IN ('[]', '', NULL)
  GROUP BY id
)
UPDATE users u SET languages = ld.langs_json::text
FROM lang_data ld
WHERE u.id = ld.id;

-- Set empty languages to JSON array
UPDATE users SET languages = '[]'::text WHERE languages IN ('[]', '', NULL);

-- Now convert column types
ALTER TABLE users ALTER COLUMN skills DROP DEFAULT;
ALTER TABLE users ALTER COLUMN skills TYPE json USING skills::json;
ALTER TABLE users ALTER COLUMN skills SET DEFAULT '[]'::json;

ALTER TABLE users ALTER COLUMN languages DROP DEFAULT;
ALTER TABLE users ALTER COLUMN languages TYPE json USING languages::json;
ALTER TABLE users ALTER COLUMN languages SET DEFAULT '[]'::json;

-- Convert portfolio_items.skills_demonstrated from ARRAY to JSON
ALTER TABLE portfolio_items ALTER COLUMN skills_demonstrated TYPE json USING 
  CASE WHEN skills_demonstrated IS NULL THEN '[]'::json
       ELSE json_agg(skills_demonstrated) OVER (PARTITION BY id) 
  END;

-- Convert invoices.line_items to JSON
UPDATE invoices SET line_items = '[]'::json WHERE line_items IS NULL OR line_items = '';
ALTER TABLE invoices ALTER COLUMN line_items TYPE json USING COALESCE(line_items::json, '[]'::json);

COMMIT;
