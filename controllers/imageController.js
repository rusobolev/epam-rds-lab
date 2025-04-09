const s3Service = require('../services/s3Service');
const dbService = require('../services/dbService');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    // Загрузка на S3
    const s3Key = await s3Service.uploadFile(file);

    // Сохранение метаданных в БД
    await dbService.insertMetadata({
      name: file.originalname,
      s3_key: s3Key,
      mime_type: file.mimetype,
      size: file.size,
    });

    res.status(200).json({ message: 'File uploaded', s3_key: s3Key });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
};
