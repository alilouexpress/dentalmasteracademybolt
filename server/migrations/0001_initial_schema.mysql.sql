-- ============================================================
-- Dental Master Academy - MySQL migration 0001: initial schema
-- Tables: site_content, purchase_requests, users, schema_migrations
--
-- Mirrors server/migrations/0001_initial_schema.sql (PostgreSQL) so the
-- resulting schema, defaults and seeded content are equivalent:
--   uuid      -> CHAR(36) (IDs generated in Node via crypto.randomUUID)
--   text      -> TEXT / VARCHAR
--   jsonb     -> JSON
--   integer   -> INT
--   boolean   -> TINYINT(1)
--   timestamptz -> DATETIME(6) (stored in UTC; driver timezone='Z')
--   ON CONFLICT DO NOTHING -> INSERT IGNORE
--
-- Safe to re-run: CREATE TABLE IF NOT EXISTS + INSERT IGNORE.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_content (
  id INT PRIMARY KEY CHECK (id = 1),
  hero_title TEXT NOT NULL DEFAULT 'DENTAL MASTER ACADEMY',
  hero_subtitle TEXT NOT NULL DEFAULT 'La première bibliothèque clinique hors ligne destinée aux chirurgiens-dentistes francophones.',
  hero_image_url TEXT NOT NULL DEFAULT '/images/hero/ChatGPT_Image_26_juil._2026,_01_41_15.png',
  product_image_url TEXT NOT NULL DEFAULT '/images/product/ChatGPT_Image_26_juil._2026,_01_05_56.png',
  app_image_1_url TEXT NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(1).png',
  app_image_2_url TEXT NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(2).png',
  academy_image_url TEXT NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png',
  price_ssd TEXT NOT NULL DEFAULT '19 900 DA',
  price_install TEXT NOT NULL DEFAULT '14 900 DA',
  whatsapp_number TEXT NOT NULL DEFAULT '213670491102',
  final_cta_title TEXT NOT NULL DEFAULT 'Start Building Your Clinical Library Today.',
  logo_image_url TEXT NOT NULL DEFAULT '',
  hero_mode TEXT NOT NULL DEFAULT 'normal',
  hero_carousel_images JSON NOT NULL DEFAULT '[]',
  hero_video_url TEXT NOT NULL DEFAULT '',
  hero_overlay_opacity INT NOT NULL DEFAULT 60,
  hero_zoom INT NOT NULL DEFAULT 100,
  hero_text_enabled TINYINT(1) NOT NULL DEFAULT 1,
  hero_text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  hero_text_size INT NOT NULL DEFAULT 100,
  academy_image_1 TEXT NOT NULL DEFAULT '',
  academy_image_2 TEXT NOT NULL DEFAULT '',
  academy_image_3 TEXT NOT NULL DEFAULT '',
  academy_image_4 TEXT NOT NULL DEFAULT '',
  academy_image_5 TEXT NOT NULL DEFAULT '',
  academy_image_6 TEXT NOT NULL DEFAULT '',
  academy_image_7 TEXT NOT NULL DEFAULT '',
  academy_image_8 TEXT NOT NULL DEFAULT '',
  academy_image_9 TEXT NOT NULL DEFAULT '',
  academy_image_10 TEXT NOT NULL DEFAULT '',
  texts JSON NOT NULL DEFAULT '{}',
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_content (id) VALUES (1);

CREATE TABLE IF NOT EXISTS purchase_requests (
  id CHAR(36) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT DEFAULT '',
  specialty TEXT DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'ssd',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
