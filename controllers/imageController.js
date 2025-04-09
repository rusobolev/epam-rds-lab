const s3Service = require('../services/s3Service');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    // Загрузка на S3
    const s3Key = await s3Service.uploadFile(file);

    // Извлекаем метаданные
    const fileExtension = file.originalname.split('.').pop();
    const fileSize = file.size;

    // Сохранение метаданных в БД
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

exports.downloadImage = async (req, res) => {
  const { fileName } = req.params;

  try {
    // Проверяем, существует ли файл на S3
    const fileExists = await s3Service.getFile(fileName);

    if (!fileExists) {
      return res.status(404).send('File not found');
    }

    const fileContent = await s3Service.downloadFile(fileName);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(fileContent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while downloading the file');
  }
};
