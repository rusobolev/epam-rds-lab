const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: process.env.AWS_REGION });

const queueUrl = process.env.SQS_QUEUE_URL;

exports.sendMessage = async (messageBody) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };
  await sqs.sendMessage(params).promise();
};

exports.receiveMessages = async () => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 5,
  };
  const result = await sqs.receiveMessage(params).promise();
  return result.Messages || [];
};

exports.deleteMessage = async (receiptHandle) => {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };
  await sqs.deleteMessage(params).promise();
};
