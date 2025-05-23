require('dotenv').config();
require('./backgroundProcessor');
const express = require('express');
const multer = require('multer');
const imageController = require('./controllers/imageController');
const { triggerConsistencyCheck } = require('./controllers/triggerController');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.delete('/delete/:fileName', imageController.deleteImage);

app.post('/upload', upload.single('image'), imageController.uploadImage);

app.post('/subscribe', imageController.subscribeEmail);

app.post('/unsubscribe', imageController.unsubscribeEmail);

app.get('/download/:fileName', imageController.downloadImage);

app.get('/metadata/random', imageController.getRandomImageMetadata);

app.get('/metadata/:fileName', imageController.getImageMetadata);

app.get('/trigger-consistency-check', triggerConsistencyCheck);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}\n`);
});
