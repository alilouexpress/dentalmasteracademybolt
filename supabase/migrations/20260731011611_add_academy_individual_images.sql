/*
# Add individual image columns for each academy

Adds 10 separate image URL columns to site_content, one per academy card.
Default value is the existing shared academy image so existing deployments
keep their current appearance without any manual action.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_1') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_1 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_2') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_2 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_3') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_3 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_4') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_4 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_5') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_5 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_6') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_6 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_7') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_7 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_8') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_8 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_9') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_9 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_content' AND column_name='academy_image_10') THEN
    ALTER TABLE site_content ADD COLUMN academy_image_10 text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png';
  END IF;
END $$;
