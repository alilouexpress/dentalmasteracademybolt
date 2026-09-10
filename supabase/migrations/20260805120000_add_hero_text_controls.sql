/*
# Add hero text controls
- hero_text_enabled: boolean - show/hide the hero text block (title, subtitle, badge, stats, buttons)
- hero_text_color: text - color of the hero title (hex)
- hero_text_size: integer - size of the hero title as a percentage (50-200)
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_text_enabled') THEN
    ALTER TABLE site_content ADD COLUMN hero_text_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_text_color') THEN
    ALTER TABLE site_content ADD COLUMN hero_text_color text NOT NULL DEFAULT '#FFFFFF';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_text_size') THEN
    ALTER TABLE site_content ADD COLUMN hero_text_size integer NOT NULL DEFAULT 100;
  END IF;
END $$;
