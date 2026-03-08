const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'upload');

// Vérification admin côté serveur
app.use(express.json());
app.post('/api/admin-login', (req, res) => {
  const { user, pass } = req.body;
  // Ces valeurs ne sont plus dans le frontend !
  if (user === 'admin' && pass === 'Stjopiumx@29') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Nom ou code incorrect' });
  }
});


app.use(cors());
app.use(express.static(__dirname));
app.use('/upload', express.static(UPLOAD_DIR));

// Sert index.html à la racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sert slideshow.html sur /slideshow
app.get('/slideshow', (req, res) => {
  res.sendFile(path.join(__dirname, 'slideshow.html'));
});

// Sert admin.html sur /panel
app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Middleware pour parser les champs texte avant l'upload
app.use(express.urlencoded({ extended: true }));

// Upload endpoint
app.post('/api/upload', upload.array('photos'), (req, res) => {
  const files = req.files.map(f => ({
    filename: f.filename,
    url: `/upload/${f.filename}`
  }));
  res.json({ success: true, files });
});

// List photos
app.get('/api/photos', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture dossier' });
    const photos = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)).map(f => ({
      filename: f,
      url: `/upload/${f}`
    }));
    res.json(photos);
  });
});

// Delete photo
app.delete('/api/photos/:filename', (req, res) => {
  const file = path.join(UPLOAD_DIR, req.params.filename);
  fs.unlink(file, err => {
    if (err) return res.status(404).json({ error: 'Fichier non trouvé' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
