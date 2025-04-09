const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;

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

exports.downloadFile = async (s3Key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body;
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      throw new Error('File not found'); 
    }
    throw err;
  }
};

exports.deleteFile = async (fileName) => {
  try {
    await s3
      .headObject({ Bucket: bucketName, Key: fileName })
      .promise();
  } catch (err) {
    if (err.code === 'NotFound') {
      throw new Error('File not found');
    }
    throw err;
  }

  return s3
    .deleteObject({ Bucket: bucketName, Key: fileName })
    .promise();
};
