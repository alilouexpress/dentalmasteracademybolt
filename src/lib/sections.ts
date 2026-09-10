const KEY_SECTION: Array<[RegExp, string]> = [
  [/^nav_/, 'navbar'],
  [/^logo_/, 'navbar'],
  [/^hero_/, 'hero'],
  [/^showcase_/, 'showcase'],
  [/^app_/, 'application'],
  [/^academy_/, 'academies'],
  [/^academies_/, 'academies'],
  [/^benefit_/, 'benefits'],
  [/^benefits_/, 'benefits'],
  [/^comp_/, 'comparison'],
  [/^comparison_/, 'comparison'],
  [/^plan_/, 'pricing'],
  [/^pricing_/, 'pricing'],
  [/^price_/, 'pricing'],
  [/^faq_/, 'faq'],
  [/^final_/, 'final-cta'],
  [/^footer_/, 'final-cta'],
  [/^form_/, 'order'],
  [/^sticky_/, 'sticky'],
];

const NON_TEXT_SECTIONS: Record<string, string> = {
  hero_image_url: 'hero',
  hero_video_url: 'hero',
  hero_mode: 'hero',
  hero_overlay_opacity: 'hero',
  hero_zoom: 'hero',
  hero_text_enabled: 'hero',
  hero_text_color: 'hero',
  hero_text_size: 'hero',
  hero_carousel_images: 'hero',
  product_image_url: 'showcase',
  app_image_1_url: 'application',
  app_image_2_url: 'application',
  academy_image_url: 'academies',
  logo_image_url: 'navbar',
  whatsapp_number: 'hero',
  price_ssd: 'pricing',
  price_install: 'pricing',
  final_cta_title: 'final-cta',
};

export function keyToSection(key: string): string | null {
  if (NON_TEXT_SECTIONS[key]) return NON_TEXT_SECTIONS[key];
  if (/^academy_image_\d+$/.test(key)) return 'academies';
  if (/^app_image/.test(key)) return 'application';
  for (const [re, section] of KEY_SECTION) {
    if (re.test(key)) return section;
  }
  return null;
}
