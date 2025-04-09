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

// Функция для проверки существования файла в S3
exports.getFile = async (s3Key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    };

    // Проверяем наличие файла с таким ключом
    await s3.headObject(params).promise();
    return true; // Файл существует
  } catch (err) {
    if (err.code === 'NotFound') {
      return false; // Файл не найден
    }
    throw err; // Другие ошибки
  }
};

// Функция для скачивания файла с S3
exports.downloadFile = async (s3Key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
  };

  // Скачиваем файл
  const data = await s3.getObject(params).promise();
  return data.Body; // Возвращаем содержимое файла
};
