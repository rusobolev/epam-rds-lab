const AWS = require('aws-sdk');

const sns = new AWS.SNS({ region: process.env.AWS_REGION });

//const topicArn = process.env.SNS_TOPIC_ARN;
const topicArn = "arn:aws:sns:us-east-1:159447948044:epamASobolev-UploadsNotificationTopic";

exports.publishNotification = async (message) => {
  const params = {
    TopicArn: topicArn,
    Message: message,
  };
  await sns.publish(params).promise();
};

exports.subscribeEmail = async (email) => {
    const params = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: email,
    };
  
    return sns.subscribe(params).promise();
  };

exports.unsubscribeEmail = async (subscriptionArn) => {
  const params = {
    SubscriptionArn: subscriptionArn,
  };
 
  return sns.unsubscribe(params).promise();
};