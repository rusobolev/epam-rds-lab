const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;