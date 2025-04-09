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
