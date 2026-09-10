/*
# Add hero overlay opacity and zoom controls
- hero_overlay_opacity: 0-100 (percentage of dark overlay over background)
- hero_zoom: 100-200 (percentage of zoom/scale on background images)
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_overlay_opacity') THEN
    ALTER TABLE site_content ADD COLUMN hero_overlay_opacity integer NOT NULL DEFAULT 60;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_zoom') THEN
    ALTER TABLE site_content ADD COLUMN hero_zoom integer NOT NULL DEFAULT 100;
  END IF;
END $$;
