// 404 + centralized error handling.
export function notFound(_req, res) {
  res.status(404).json({ error: 'Route introuvable.' });
}

export function errorHandler(err, _req, res, _next) {
  if (err && err.code === 'UNSUPPORTED_FILE_TYPE') {
    return res.status(400).json({ error: err.message });
  }
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: `Erreur d'envoi du fichier : ${err.message}` });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Corps de requête invalide.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Requête trop volumineuse.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erreur serveur interne.' });
}
