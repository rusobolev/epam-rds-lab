require('dotenv').config();
const express = require('express');
const multer = require('multer');
const imageController = require('./controllers/imageController');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), imageController.uploadImage);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}\n`);
});
