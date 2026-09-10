import pool from '../db.js';

const CONTENT_COLUMNS = [
  'hero_title', 'hero_subtitle', 'hero_image_url', 'product_image_url',
  'app_image_1_url', 'app_image_2_url', 'academy_image_url',
  'price_ssd', 'price_install', 'whatsapp_number', 'final_cta_title',
  'logo_image_url', 'hero_mode', 'hero_video_url',
  'hero_overlay_opacity', 'hero_zoom', 'hero_text_enabled', 'hero_text_color', 'hero_text_size',
  'academy_image_1', 'academy_image_2', 'academy_image_3', 'academy_image_4', 'academy_image_5',
  'academy_image_6', 'academy_image_7', 'academy_image_8', 'academy_image_9', 'academy_image_10',
  'texts', 'hero_carousel_images',
];

const JSON_COLUMNS = ['texts', 'hero_carousel_images'];
const INTEGER_COLUMNS = new Set(['hero_overlay_opacity', 'hero_zoom', 'hero_text_size']);
const BOOLEAN_COLUMNS = new Set(['hero_text_enabled']);
const HERO_MODES = new Set(['normal', 'video', 'carousel', 'scroll', 'hero']);
const MAX_STRING_LENGTH = 5000;

function validateValue(col, value) {
  if (col === 'texts') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  if (col === 'hero_carousel_images') {
    return Array.isArray(value);
  }
  if (INTEGER_COLUMNS.has(col)) {
    return typeof value === 'number' && Number.isFinite(value);
  }
  if (BOOLEAN_COLUMNS.has(col)) {
    return typeof value === 'boolean';
  }
  if (typeof value !== 'string' || value.length > MAX_STRING_LENGTH) return false;
  if (col === 'hero_mode' && !HERO_MODES.has(value)) return false;
  return true;
}

export async function getContent(_req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM site_content WHERE id = 1 LIMIT 1');
    if (rows.length === 0) return res.status(404).json({ error: 'Contenu introuvable.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}

export async function updateContent(req, res) {
  try {
    const body = req.body || {};
    const sets = [];
    const values = [];
    for (const col of CONTENT_COLUMNS) {
      if (body[col] === undefined) continue;
      if (!validateValue(col, body[col])) {
        return res.status(400).json({ error: `Valeur invalide pour le champ « ${col} ».` });
      }
      values.push(JSON_COLUMNS.includes(col) ? JSON.stringify(body[col]) : body[col]);
      sets.push(`${col} = ?`);
    }
    if (values.length > 0) {
      values.push(new Date());
      sets.push(`updated_at = ?`);
      await pool.query(`UPDATE site_content SET ${sets.join(', ')} WHERE id = 1`, values);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}
