/*
# Create site content, purchase requests, and storage for Dental Master Academy

1. New Tables
- `site_content`: stores editable content for the landing page (hero text, images, prices, etc.)
  - `id` (int, primary key, always 1 — single row table)
  - `hero_title` (text) — main headline
  - `hero_subtitle` (text) — subheadline
  - `hero_image_url` (text) — hero background image
  - `product_image_url` (text) — product showcase image
  - `app_image_1_url` (text) — first app screenshot
  - `app_image_2_url` (text) — second app screenshot
  - `academy_image_url` (text) — academy card image
  - `price_ssd` (text) — SSD option price
  - `price_install` (text) — installation option price
  - `whatsapp_number` (text) — WhatsApp contact number
  - `final_cta_title` (text) — final CTA heading
  - `updated_at` (timestamptz)
- `purchase_requests`: stores client purchase form submissions
  - `id` (uuid, primary key)
  - `full_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text, not null)
  - `country` (text)
  - `specialty` (text) — dental specialty
  - `plan` (text) — 'ssd' or 'install'
  - `message` (text)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- `site_content`: readable by anon+authenticated (public site needs to display it);
  writable only by authenticated (admin).
- `purchase_requests`: insertable by anon (clients submit forms);
  all other operations restricted to authenticated (admin manages orders).

3. Storage
- Create a public storage bucket `site-assets` for uploading images.
*/

-- ============================================================
-- site_content table (single-row settings table)
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
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public can read site content
DROP POLICY IF EXISTS "anon_read_site_content" ON site_content;
CREATE POLICY "anon_read_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated admin can update
DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;
CREATE POLICY "auth_update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admin can insert (seed row)
DROP POLICY IF EXISTS "auth_insert_site_content" ON site_content;
CREATE POLICY "auth_insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed the single row if it doesn't exist
INSERT INTO site_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- purchase_requests table
-- ============================================================
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

ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can submit a purchase request
DROP POLICY IF EXISTS "anon_insert_purchase" ON purchase_requests;
CREATE POLICY "anon_insert_purchase" ON purchase_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can view orders
DROP POLICY IF EXISTS "auth_select_purchases" ON purchase_requests;
CREATE POLICY "auth_select_purchases" ON purchase_requests FOR SELECT
  TO authenticated USING (true);

-- Only authenticated admin can update order status
DROP POLICY IF EXISTS "auth_update_purchases" ON purchase_requests;
CREATE POLICY "auth_update_purchases" ON purchase_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admin can delete orders
DROP POLICY IF EXISTS "auth_delete_purchases" ON purchase_requests;
CREATE POLICY "auth_delete_purchases" ON purchase_requests FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- Storage bucket for image uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read uploaded images
DROP POLICY IF EXISTS "anon_read_site_assets" ON storage.objects;
CREATE POLICY "anon_read_site_assets" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'site-assets');

-- Only authenticated admin can upload images
DROP POLICY IF EXISTS "auth_upload_site_assets" ON storage.objects;
CREATE POLICY "auth_upload_site_assets" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'site-assets');

-- Only authenticated admin can delete images
DROP POLICY IF EXISTS "auth_delete_site_assets" ON storage.objects;
CREATE POLICY "auth_delete_site_assets" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'site-assets');
