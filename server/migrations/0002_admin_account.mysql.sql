-- Dental Master Academy - migration 0002: single administrator account
-- Creates the one administrator record used by the private dashboard.
-- The password is stored only as a bcrypt hash; the original password is not
-- included in this file or returned by the API.

INSERT IGNORE INTO users (email, password_hash)
VALUES (
  'alilouexpressdz@gmail.com',
  '$2b$12$U/qC5B6Qr36MXg9ScPd.huETC8x8KdZsfmDjBlR70l234XGKq38ea'
);
