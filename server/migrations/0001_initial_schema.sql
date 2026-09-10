-- ============================================================
-- Dental Master Academy - migration 0001: initial schema
-- Tables: site_content, purchase_requests, users
--
-- This migration reflects the exact state of the original
-- server/schema.sql. It is safe to apply on an existing
-- database: CREATE TABLE IF NOT EXISTS and ON CONFLICT DO
-- NOTHING mean existing tables and rows are never touched.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title text NOT NULL DEFAULT 'DENTAL MASTER ACADEMY',
  hero_subtitle text NOT NULL DEFAULT 'La première bibliothèque clinique hors ligne destinée aux chirurgiens-dentistes francophones.',
  hero_image_url text NOT NULL DEFAULT '/images/hero/ChatGPT_Image_26_juil._2026,_01_41_15.png',
  product_image_url text NOT NULL DEFAULT '/images/product/ChatGPT_Image_26_juil._2026,_01_05_56.png',
  app_image_1_url text NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(1).png',
  app_image_2_url text NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(2).png',
  academy_image_url text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png',
  price_ssd text NOT NULL DEFAULT '19 900 DA',
  price_install text NOT NULL DEFAULT '14 900 DA',
  whatsapp_number text NOT NULL DEFAULT '213670491102',
  final_cta_title text NOT NULL DEFAULT 'Start Building Your Clinical Library Today.',
  logo_image_url text NOT NULL DEFAULT '',
  hero_mode text NOT NULL DEFAULT 'normal',
  hero_carousel_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero_video_url text NOT NULL DEFAULT '',
  hero_overlay_opacity integer NOT NULL DEFAULT 60,
  hero_zoom integer NOT NULL DEFAULT 100,
  hero_text_enabled boolean NOT NULL DEFAULT true,
  hero_text_color text NOT NULL DEFAULT '#FFFFFF',
  hero_text_size integer NOT NULL DEFAULT 100,
  academy_image_1 text NOT NULL DEFAULT '',
  academy_image_2 text NOT NULL DEFAULT '',
  academy_image_3 text NOT NULL DEFAULT '',
  academy_image_4 text NOT NULL DEFAULT '',
  academy_image_5 text NOT NULL DEFAULT '',
  academy_image_6 text NOT NULL DEFAULT '',
  academy_image_7 text NOT NULL DEFAULT '',
  academy_image_8 text NOT NULL DEFAULT '',
  academy_image_9 text NOT NULL DEFAULT '',
  academy_image_10 text NOT NULL DEFAULT '',
  texts jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS purchase_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text DEFAULT '',
  specialty text DEFAULT '',
  plan text NOT NULL DEFAULT 'ssd',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
