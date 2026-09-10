/*
# Add JSONB "texts" column for all editable site text

Stores every user-editable text on the site in a single JSONB column.
The application reads from this column with built-in defaults as fallback,
so the site works even before any value is saved.
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='texts') THEN
    ALTER TABLE site_content ADD COLUMN texts jsonb NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END $$;
