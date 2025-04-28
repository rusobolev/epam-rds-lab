const AWS = require('aws-sdk');

const sns = new AWS.SNS({ region: process.env.AWS_REGION });

const topicArn = process.env.SNS_TOPIC_ARN;

exports.publishNotification = async (message) => {
  const params = {
    TopicArn: topicArn,
    Message: message,
  };
  await sns.publish(params).promise();
};
