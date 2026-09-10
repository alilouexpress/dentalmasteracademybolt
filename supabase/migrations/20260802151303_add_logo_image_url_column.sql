/*
# Add logo_image_url column to site_content
Allows the admin to upload a custom logo image from the dashboard.
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='logo_image_url') THEN
    ALTER TABLE site_content ADD COLUMN logo_image_url text;
  END IF;
END $$;
