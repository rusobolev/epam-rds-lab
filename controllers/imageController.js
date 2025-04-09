const s3Service = require('../services/s3Service');
const dbService = require('../services/dbService');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const s3Key = await s3Service.uploadFile(file);

    const fileExtension = file.originalname.split('.').pop();
    const fileSize = file.size;

    await dbService.insertMetadata({
      name: file.originalname,
      s3_key: s3Key,
      file_extension: fileExtension,
      size: fileSize,
    });

    res.status(200).json({ message: 'File uploaded and metadata saved', s3_key: s3Key });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
};
