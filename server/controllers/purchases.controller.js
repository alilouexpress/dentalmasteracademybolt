import crypto from 'node:crypto';
import pool from '../db.js';

const PLANS = new Set(['ssd', 'install']);
const STATUSES = new Set(['pending', 'confirmed', 'rejected']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{2,29}$/;
const MAX_LENGTH = { full_name: 120, email: 120, phone: 30, country: 120, specialty: 120, plan: 20, message: 2000 };

function invalid(field) {
  const err = new Error(`Champ « ${field} » invalide.`);
  err.code = 'VALIDATION_ERROR';
  return err;
}

export async function list(_req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM purchase_requests ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}

export async function create(req, res) {
  try {
    const { full_name, email, phone, country, specialty, plan, message } = req.body || {};

    const fields = { full_name, email, phone, country, specialty, plan, message };
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined) continue;
      if (typeof value !== 'string' || value.length > MAX_LENGTH[key]) throw invalid(key);
    }
    if (typeof full_name !== 'string' || full_name.trim().length === 0) throw invalid('full_name');
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > MAX_LENGTH.email) throw invalid('email');
    if (typeof phone !== 'string' || !PHONE_RE.test(phone.trim()) || phone.length > MAX_LENGTH.phone) throw invalid('phone');
    if (plan !== undefined && !PLANS.has(plan)) throw invalid('plan');

    const id = crypto.randomUUID();
    const createdAt = new Date();
    await pool.query(
      `INSERT INTO purchase_requests (id, full_name, email, phone, country, specialty, plan, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, full_name.trim(), email.trim().toLowerCase(), phone.trim(), country || '', specialty || '', plan || 'ssd', message || '', createdAt]
    );
    res.status(201).json({
      id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      country: country || '',
      specialty: specialty || '',
      plan: plan || 'ssd',
      message: message || '',
      status: 'pending',
      created_at: createdAt.toISOString(),
    });
  } catch (err) {
    if (err && err.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body || {};
    if (typeof status !== 'string' || !STATUSES.has(status)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }
    await pool.query('UPDATE purchase_requests SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}

export async function remove(req, res) {
  try {
    await pool.query('DELETE FROM purchase_requests WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}
