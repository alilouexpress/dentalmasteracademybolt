/*
# Add hero background mode columns
- hero_mode: 'normal' (single image), 'carousel' (rotating images), 'video' (background video), 'scroll' (image per scroll section)
- hero_carousel_images: JSONB array of image URLs for carousel/scroll modes
- hero_video_url: URL for video background mode
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_mode') THEN
    ALTER TABLE site_content ADD COLUMN hero_mode text NOT NULL DEFAULT 'normal';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_carousel_images') THEN
    ALTER TABLE site_content ADD COLUMN hero_carousel_images jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='hero_video_url') THEN
    ALTER TABLE site_content ADD COLUMN hero_video_url text;
  END IF;
END $$;
