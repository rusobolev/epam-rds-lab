const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

exports.uploadFile = async (file) => {
  const key = file.originalname;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.putObject(params).promise();
  return key;
};

// Функция для проверки и скачивания файла с S3
exports.downloadFile = async (s3Key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
  };

  try {
    // Пытаемся получить объект с S3
    const data = await s3.getObject(params).promise();
    return data.Body; // Возвращаем содержимое файла
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      throw new Error('File not found'); // Если файла нет, выбрасываем ошибку
    }
    throw err; // Для других ошибок
  }
};
