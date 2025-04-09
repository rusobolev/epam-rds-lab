require('dotenv').config();
const express = require('express');
const multer = require('multer');
const s3Service = require('./s3Service');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');

    const s3Key = await s3Service.uploadFile(req.file);
    console.log(`File uploaded: ${s3Key}\n`);

    res.json({ message: 'File uploaded', s3_key: s3Key });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}\n`);
});
