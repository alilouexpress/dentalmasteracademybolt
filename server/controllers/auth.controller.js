import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { signToken, revokeToken } from '../lib/tokens.js';
import { setAuthCookie, clearAuthCookie, readAuthCookie } from '../lib/cookies.js';
import { BCRYPT_ROUNDS } from '../config/env.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validates and normalizes credentials. Returns a cleaned, lowercased email or
// a user-facing validation error. Never exposes whether the account exists.
function validateCredentials(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(cleanEmail)) {
    return { error: 'Adresse email invalide.' };
  }
  if (typeof password !== 'string' || password.length === 0) {
    return { error: 'Mot de passe requis.' };
  }
  if (password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caractères.' };
  }
  return { email: cleanEmail, error: null };
}

export async function me(req, res) {
  try {
    const { rows } = await pool.query('SELECT id, email FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('[auth:me]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const { email: cleanEmail, error } = validateCredentials(email, password);
  if (error) return res.status(400).json({ error });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = LOWER(?)', [cleanEmail]);
    const user = rows[0];
    const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!passwordOk) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    setAuthCookie(res, signToken(user));
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[auth:login]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

export function logout(req, res) {
  const header = req.headers.authorization || '';
  const bearerToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  const cookieToken = readAuthCookie(req);
  if (bearerToken) revokeToken(bearerToken);
  if (cookieToken) revokeToken(cookieToken);
  clearAuthCookie(res);
  res.json({ ok: true });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    if (!(await bcrypt.compare(currentPassword || '', user.password_hash))) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
    }
    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[auth:changePassword]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}
