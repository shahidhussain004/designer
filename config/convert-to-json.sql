-- Convert projects columns from text[] to json type
ALTER TABLE projects 
  ALTER COLUMN required_skills 
  TYPE json USING array_to_json(required_skills);

ALTER TABLE projects 
  ALTER COLUMN preferred_skills 
  TYPE json USING array_to_json(preferred_skills);

-- Convert portfolio_items columns from text[] to json type
ALTER TABLE portfolio_items 
  ALTER COLUMN technologies 
  TYPE json USING array_to_json(technologies);

ALTER TABLE portfolio_items 
  ALTER COLUMN images 
  TYPE json USING array_to_json(images);

ALTER TABLE portfolio_items 
  ALTER COLUMN tools_used 
  TYPE json USING array_to_json(tools_used);

-- Verify the conversion
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE (table_name IN ('users', 'projects', 'portfolio_items', 'invoices') 
AND (data_type = 'json' OR data_type LIKE '%[]%')) 
ORDER BY table_name, column_name;
