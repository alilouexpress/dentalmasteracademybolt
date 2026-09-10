export function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' });
  res.json({ url: `/uploads/${req.file.filename}` });
}
