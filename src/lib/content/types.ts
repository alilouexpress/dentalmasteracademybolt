export interface SiteContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  product_image_url: string;
  app_image_1_url: string;
  app_image_2_url: string;
  academy_image_url: string;
  academy_image_1: string;
  academy_image_2: string;
  academy_image_3: string;
  academy_image_4: string;
  academy_image_5: string;
  academy_image_6: string;
  academy_image_7: string;
  academy_image_8: string;
  academy_image_9: string;
  academy_image_10: string;
  price_ssd: string;
  price_install: string;
  whatsapp_number: string;
  logo_image_url: string;
  hero_mode: string;
  hero_carousel_images: string[];
  hero_video_url: string;
  hero_overlay_opacity: number;
  hero_zoom: number;
  hero_text_enabled: boolean;
  hero_text_color: string;
  hero_text_size: number;
  final_cta_title: string;
  texts: Record<string, string>;
  updated_at: string;
}

export interface PurchaseRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  specialty: string;
  plan: string;
  message: string;
  status: string;
  created_at: string;
}
