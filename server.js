const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safe);
  }
});
const upload = multer({ storage });

const postsFile = path.join(__dirname, 'public', 'data', 'posts.json');

app.get('/api/posts', async (req, res) => {
  try {
    const txt = await fs.readFile(postsFile, 'utf8');
    res.json(JSON.parse(txt));
  } catch (err) {
    res.status(500).json({ error: 'Unable to read posts' });
  }
});

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const { title, author, type, excerpt } = req.body;
    const files = req.files;
    if (!title || !author || !type || !files || files.length === 0) return res.status(400).json({ error: 'Missing fields' });

    const txt = await fs.readFile(postsFile, 'utf8');
    const posts = JSON.parse(txt);
    const newPost = {
      id: String(Date.now()),
      title,
      type,
      author,
      date: new Date().toISOString().slice(0, 10),
      excerpt: excerpt || '',
      files: files.map(f => `uploads/${f.filename}`)
    };
    posts.unshift(newPost);
    await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), 'utf8');
    res.json({ success: true, post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(PORT, () => console.log(`Server listening: http://localhost:${PORT}`));
