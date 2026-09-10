import type { SiteContent } from '@/lib/content';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'toggle' | 'color' | 'range' | 'select' | 'image' | 'video' | 'carousel' | 'number';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string; desc?: string }[];
  colorOptions?: string[];
  placeholder?: string;
  hint?: string;
  show?: (content: SiteContent) => boolean;
}

export interface SectionDef {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

const HERO_TEXT_COLORS = ['#FFFFFF', '#E8B630', '#48D9FC', '#22C55E', '#F472B6'];

const text = (key: string, label: string, extra?: Partial<FieldDef>): FieldDef => ({
  key,
  label,
  type: 'text',
  ...extra,
});

const textarea = (key: string, label: string, extra?: Partial<FieldDef>): FieldDef => ({
  key,
  label,
  type: 'textarea',
  ...extra,
});

const image = (key: string, label: string, extra?: Partial<FieldDef>): FieldDef => ({
  key,
  label,
  type: 'image',
  ...extra,
});

const range = (key: string, label: string, min: number, max: number, extra?: Partial<FieldDef>): FieldDef => ({
  key,
  label,
  type: 'range',
  min,
  max,
  step: 5,
  ...extra,
});

export const SECTIONS: SectionDef[] = [
  {
    id: 'navbar',
    title: 'Barre de Navigation',
    subtitle: 'Liens et bouton',
    fields: [
      text('nav_logo_title', 'Titre du logo'),
      text('nav_logo_sub', 'Sous-titre du logo'),
      text('nav_link_1', 'Lien 1'),
      text('nav_link_2', 'Lien 2'),
      text('nav_link_3', 'Lien 3'),
      text('nav_link_4', 'Lien 4'),
      text('nav_link_5', 'Lien 5'),
      text('nav_cta', 'Bouton CTA'),
      text('nav_admin', 'Lien Admin'),
    ],
  },
  {
    id: 'hero',
    title: 'Section Hero',
    subtitle: "Titre d'accueil, stats et fond",
    fields: [
      { key: 'hero_text_enabled', label: 'Afficher le texte', type: 'toggle' },
      { key: 'hero_text_color', label: 'Couleur du texte', type: 'color', colorOptions: HERO_TEXT_COLORS },
      range('hero_text_size', 'Taille du texte', 50, 200, { unit: '%', hint: '100% = taille d’origine.' }),
      text('hero_badge', 'Badge'),
      text('hero_title_1', 'Titre — ligne 1'),
      text('hero_title_2', 'Titre — ligne 2'),
      text('hero_title_3', 'Titre — ligne 3'),
      textarea('hero_subtitle', 'Sous-titre'),
      text('hero_stat_1_label', 'Statistique 1'),
      text('hero_stat_2_label', 'Statistique 2'),
      text('hero_stat_3_label', 'Statistique 3'),
      text('hero_stat_4_label', 'Statistique 4'),
      text('hero_cta_1', 'Bouton 1'),
      text('hero_cta_2', 'Bouton 2'),
      text('whatsapp_number', 'Numéro WhatsApp'),
      {
        key: 'hero_mode',
        label: 'Mode d’arrière-plan',
        type: 'select',
        options: [
          { value: 'normal', label: 'Photo unique' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'video', label: 'Vidéo' },
          { value: 'scroll', label: 'Au scroll' },
        ],
      },
      range('hero_overlay_opacity', 'Assombrissement du fond', 0, 100, { unit: '%' }),
      range('hero_zoom', 'Zoom des images', 100, 200, { unit: '%' }),
      image('hero_image_url', 'Image de fond', { show: (c) => (c.hero_mode || 'normal') === 'normal' }),
      {
        key: 'hero_video_url',
        label: 'Vidéo de fond',
        type: 'video',
        show: (c) => c.hero_mode === 'video',
      },
      {
        key: 'hero_carousel_images',
        label: 'Images',
        type: 'carousel',
        show: (c) => c.hero_mode === 'carousel' || c.hero_mode === 'scroll',
      },
    ],
  },
  {
    id: 'showcase',
    title: 'Produit SSD',
    subtitle: 'Présentation du produit',
    fields: [
      image('product_image_url', 'Image du produit'),
      text('showcase_label', 'Label'),
      text('showcase_title_1', 'Titre 1'),
      text('showcase_title_2', 'Titre 2'),
      textarea('showcase_desc', 'Description'),
      text('showcase_pill_1', 'Pilule 1'),
      text('showcase_pill_2', 'Pilule 2'),
      text('showcase_pill_3', 'Pilule 3'),
      text('showcase_pill_4', 'Pilule 4'),
      text('showcase_badge_title', 'Badge — titre'),
      text('showcase_badge_desc', 'Badge — description'),
      text('showcase_floating_badge', 'Badge flottant'),
    ],
  },
  {
    id: 'application',
    title: 'Application',
    subtitle: "Aperçu de l'interface",
    fields: [
      image('app_image_1_url', 'Capture d’écran 1'),
      image('app_image_2_url', 'Capture d’écran 2'),
      text('app_label', 'Label'),
      text('app_title_1', 'Titre 1'),
      text('app_title_2', 'Titre 2'),
      textarea('app_desc', 'Description'),
      text('app_shot1_badge', 'Capture 1 — badge'),
      text('app_shot1_title', 'Capture 1 — titre'),
      text('app_shot1_desc', 'Capture 1 — description'),
      text('app_shot2_badge', 'Capture 2 — badge'),
      text('app_shot2_title', 'Capture 2 — titre'),
      text('app_shot2_desc', 'Capture 2 — description'),
      text('app_feat_1', 'Fonctionnalité 1'),
      text('app_feat_2', 'Fonctionnalité 2'),
      text('app_feat_3', 'Fonctionnalité 3'),
      text('app_feat_4', 'Fonctionnalité 4'),
    ],
  },
  {
    id: 'academies',
    title: 'Académies',
    subtitle: '10 spécialités',
    fields: [
      text('academies_label', 'Label'),
      text('academies_title_1', 'Titre 1'),
      text('academies_title_2', 'Titre 2'),
      textarea('academies_desc', 'Description'),
      ...Array.from({ length: 10 }, (_, i) => [
        text(`academy_${i + 1}_title`, `Académie ${i + 1} — titre`),
        textarea(`academy_${i + 1}_desc`, `Académie ${i + 1} — description`),
        image(`academy_image_${i + 1}`, `Académie ${i + 1} — photo`),
      ]).flat(),
    ],
  },
  {
    id: 'benefits',
    title: 'Avantages',
    subtitle: '8 raisons incontournables',
    fields: [
      text('benefits_label', 'Label'),
      text('benefits_title_1', 'Titre 1'),
      text('benefits_title_2', 'Titre 2'),
      textarea('benefits_desc', 'Description'),
      ...Array.from({ length: 8 }, (_, i) => [
        text(`benefit_${i + 1}_title`, `Avantage ${i + 1} — titre`),
        textarea(`benefit_${i + 1}_desc`, `Avantage ${i + 1} — description`),
      ]).flat(),
    ],
  },
  {
    id: 'comparison',
    title: 'Comparaison',
    subtitle: 'DMA vs cours en ligne',
    fields: [
      text('comparison_label', 'Label'),
      text('comparison_title_1', 'Titre 1'),
      text('comparison_title_2', 'Titre 2'),
      text('comparison_col_1', 'Colonne 1'),
      text('comparison_col_2', 'Colonne 2'),
      text('comparison_col_3', 'Colonne 3'),
      ...Array.from({ length: 10 }, (_, i) => text(`comp_feat_${i + 1}`, `Critère ${i + 1}`)),
    ],
  },
  {
    id: 'pricing',
    title: 'Tarifs',
    subtitle: 'Plans SSD et installation',
    fields: [
      text('price_ssd', 'Prix SSD', { placeholder: 'Ex : 19 900 DA' }),
      text('price_install', 'Prix installation', { placeholder: 'Ex : 14 900 DA' }),
      text('pricing_label', 'Label'),
      text('pricing_title_1', 'Titre 1'),
      text('pricing_title_2', 'Titre 2'),
      textarea('pricing_desc', 'Description'),
      text('plan_ssd_name', 'Plan SSD — nom'),
      text('plan_ssd_badge', 'Plan SSD — badge'),
      ...Array.from({ length: 6 }, (_, i) => text(`plan_ssd_feat_${i + 1}`, `Plan SSD — avantage ${i + 1}`)),
      text('plan_install_name', 'Plan installation — nom'),
      text('plan_install_badge', 'Plan installation — badge'),
      ...Array.from({ length: 5 }, (_, i) => text(`plan_install_feat_${i + 1}`, `Plan installation — avantage ${i + 1}`)),
      text('pricing_cta', 'Bouton CTA'),
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    subtitle: 'Questions fréquentes',
    fields: [
      text('faq_label', 'Label'),
      text('faq_title_1', 'Titre 1'),
      text('faq_title_2', 'Titre 2'),
      ...Array.from({ length: 7 }, (_, i) => [
        text(`faq_${i + 1}_q`, `Question ${i + 1}`),
        textarea(`faq_${i + 1}_a`, `Réponse ${i + 1}`),
      ]).flat(),
    ],
  },
  {
    id: 'final-cta',
    title: 'CTA Final & Pied de page',
    subtitle: 'Appel à l’action et mentions',
    fields: [
      text('final_cta_label', 'Label'),
      text('final_cta_title', 'Titre principal'),
      textarea('final_cta_desc', 'Description'),
      text('final_cta_button', 'Bouton'),
      text('final_cta_phone', 'Téléphone affiché'),
      text('final_trust_1', 'Élément de confiance 1'),
      text('final_trust_2', 'Élément de confiance 2'),
      text('final_trust_3', 'Élément de confiance 3'),
      text('final_trust_4', 'Élément de confiance 4'),
      text('footer_address', 'Adresse'),
      text('footer_copyright', 'Copyright'),
    ],
  },
  {
    id: 'order',
    title: 'Formulaire de commande',
    subtitle: 'Champs et messages de succès',
    fields: [
      text('form_label', 'Label'),
      text('form_title_1', 'Titre 1'),
      text('form_title_2', 'Titre 2'),
      text('form_desc', 'Description'),
      text('form_success_title', 'Succès — titre'),
      textarea('form_success_desc', 'Succès — description'),
      text('form_success_btn', 'Succès — bouton'),
      text('form_btn', 'Bouton envoyer'),
      textarea('form_note', 'Note'),
    ],
  },
  {
    id: 'sticky',
    title: 'Bouton WhatsApp',
    subtitle: 'Bouton flottant',
    fields: [
      text('sticky_top', 'Texte haut'),
      text('sticky_bottom', 'Texte bas'),
    ],
  },
];

export function getSectionById(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function getFieldDefault(key: string): string | number | boolean | undefined {
  const defaults: Record<string, string | number | boolean> = {
    hero_text_color: '#FFFFFF',
    hero_text_size: 100,
    hero_text_enabled: true,
  };
  return defaults[key];
}
