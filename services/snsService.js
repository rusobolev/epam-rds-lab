const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  region: process.env.AWS_REGION || 'us-east-1',
});

const topicArn = 'arn:aws:sns:us-east-1:159447948044:epamASobolev-UploadsNotificationTopic';

exports.subscribeEmail = async (email) => {
  const params = {
    Protocol: 'email',
    TopicArn: topicArn,
    Endpoint: email,
  };
  await sns.subscribe(params).promise();
};

exports.unsubscribeEmail = async (email) => {
  const subscriptions = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();
  const subscription = subscriptions.Subscriptions.find(sub => sub.Endpoint === email);

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  await sns.unsubscribe({ SubscriptionArn: subscription.SubscriptionArn }).promise();
};
