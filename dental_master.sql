-- ============================================================
-- DENTAL MASTER ACADEMY — base u965248485_dental_master
-- Schéma + données. À importer dans la base EXISTANTE via phpMyAdmin
-- (Import > Choose File > dental_master.sql > Go)
-- ============================================================
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1) TABLE users
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2) TABLE site_content
-- ------------------------------------------------------------
CREATE TABLE `site_content` (
  `id` int(11) NOT NULL CHECK (`id` = 1),
  `hero_title` text NOT NULL DEFAULT 'DENTAL MASTER ACADEMY',
  `hero_subtitle` text NOT NULL DEFAULT 'La première bibliothèque clinique hors ligne destinée aux chirurgiens-dentistes francophones.',
  `hero_image_url` text NOT NULL DEFAULT '/images/hero/ChatGPT_Image_26_juil._2026,_01_41_15.png',
  `product_image_url` text NOT NULL DEFAULT '/images/product/ChatGPT_Image_26_juil._2026,_01_05_56.png',
  `app_image_1_url` text NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(1).png',
  `app_image_2_url` text NOT NULL DEFAULT '/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(2).png',
  `academy_image_url` text NOT NULL DEFAULT '/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png',
  `price_ssd` text NOT NULL DEFAULT '19 900 DA',
  `price_install` text NOT NULL DEFAULT '14 900 DA',
  `whatsapp_number` text NOT NULL DEFAULT '213670491102',
  `final_cta_title` text NOT NULL DEFAULT 'Start Building Your Clinical Library Today.',
  `logo_image_url` text NOT NULL DEFAULT '',
  `hero_mode` text NOT NULL DEFAULT 'normal',
  `hero_carousel_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`hero_carousel_images`)),
  `hero_video_url` text NOT NULL DEFAULT '',
  `hero_overlay_opacity` int(11) NOT NULL DEFAULT 60,
  `hero_zoom` int(11) NOT NULL DEFAULT 100,
  `hero_text_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `hero_text_color` text NOT NULL DEFAULT '#FFFFFF',
  `hero_text_size` int(11) NOT NULL DEFAULT 100,
  `academy_image_1` text NOT NULL DEFAULT '',
  `academy_image_2` text NOT NULL DEFAULT '',
  `academy_image_3` text NOT NULL DEFAULT '',
  `academy_image_4` text NOT NULL DEFAULT '',
  `academy_image_5` text NOT NULL DEFAULT '',
  `academy_image_6` text NOT NULL DEFAULT '',
  `academy_image_7` text NOT NULL DEFAULT '',
  `academy_image_8` text NOT NULL DEFAULT '',
  `academy_image_9` text NOT NULL DEFAULT '',
  `academy_image_10` text NOT NULL DEFAULT '',
  `texts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`texts`)),
  `updated_at` datetime(6) DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3) TABLE purchase_requests
-- ------------------------------------------------------------
CREATE TABLE `purchase_requests` (
  `id` char(36) NOT NULL,
  `full_name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `country` text DEFAULT '',
  `specialty` text DEFAULT '',
  `plan` text NOT NULL DEFAULT 'ssd',
  `message` text DEFAULT '',
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4) TABLE schema_migrations
-- ------------------------------------------------------------
CREATE TABLE `schema_migrations` (
  `version` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- DONNÉES — contenu du site (id=1)
-- ------------------------------------------------------------
INSERT INTO `site_content` (`id`, `hero_title`, `hero_subtitle`, `hero_image_url`, `product_image_url`, `app_image_1_url`, `app_image_2_url`, `academy_image_url`, `price_ssd`, `price_install`, `whatsapp_number`, `final_cta_title`, `logo_image_url`, `hero_mode`, `hero_carousel_images`, `hero_video_url`, `hero_overlay_opacity`, `hero_zoom`, `hero_text_enabled`, `hero_text_color`, `hero_text_size`, `academy_image_1`, `academy_image_2`, `academy_image_3`, `academy_image_4`, `academy_image_5`, `academy_image_6`, `academy_image_7`, `academy_image_8`, `academy_image_9`, `academy_image_10`, `texts`, `updated_at`) VALUES (1,'DENTAL MASTER ACADEMY','La première bibliothèque clinique hors ligne destinée aux chirurgiens-dentistes francophones.','/images/hero/ChatGPT_Image_26_juil._2026,_01_41_15.png','/images/product/ChatGPT_Image_26_juil._2026,_01_05_56.png','/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(1).png','/images/application/ChatGPT_Image_26_juil._2026,_01_03_01_(2).png','/images/academies/ChatGPT_Image_26_juil._2026,_01_07_27.png','19 900 DA','14 900 DA','213670491102','Start Building Your Clinical Library Today.','/uploads/1786118407986-895951251.png','video','[]','/uploads/1785884986649-417157408.mp4',50,100,1,'#FFFFFF',100,'/uploads/1786111281263-499677230.png','/uploads/1786111305220-559106833.jpg','/uploads/1786111317162-83855140.png','/uploads/1786111320853-790739216.png','/uploads/1786111325013-506512448.png','/uploads/1786111338946-669058547.png','/uploads/1786111559597-691374850.png','/uploads/1786111567125-521938994.png','/uploads/1786111577295-496610676.png','/uploads/1786111582679-720299513.png','{\"app_desc\":\"Une formation pensé pour les cliniciens. Recherche instantanée, catégories claires, lecteur vidéo haute définition.\",\"hero_title_1\":\"DENTAL \",\"nav_logo_sub\":\"Academy\",\"showcase_desc\":\"Pas de cours en ligne. Pas d\'abonnement. Recevez un disque dur SSD physique contenant la formation complète, ou faites-la installer directement sur votre poste. Une expérience premium, pensée pour la pratique clinique.\",\"footer_address\":\"Adgency Academy, bordj el kiffan ALGER\",\"nav_logo_title\":\"DENTAL MASTER \"}','2026-08-12 00:09:21.906000');

-- ------------------------------------------------------------
-- DONNÉES — compte admin
-- (email: admin@dentalmaster.com / mot de passe: Admin2026!)
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `password_hash`, `created_at`) VALUES ('f27e889f-d429-4b76-b845-44871d8619a9','admin@dentalmaster.com','$2b$10$X6SrFkUYY6JpfnDweVdkvuUdbV.UGqK9W04u3ezrnNLhgV5Hum6y.','2026-08-04 22:49:06.310000');

-- ------------------------------------------------------------
-- DONNÉES — migrations appliquées (inutile de re-run migrate)
-- ------------------------------------------------------------
INSERT INTO `schema_migrations` (`version`, `name`, `applied_at`) VALUES
('0001_initial_schema.mysql.sql','0001_initial_schema.mysql.sql','2026-08-12 02:03:18.347245'),
('0001_initial_schema.sql','0001_initial_schema.sql','2026-08-08 01:35:35.969000');