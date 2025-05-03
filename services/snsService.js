const AWS = require('aws-sdk');

const sns = new AWS.SNS({ region: process.env.AWS_REGION });

const topicArn = process.env.SNS_TOPIC_ARN;

// exports.publishNotification = async (message) => {
//   const params = {
//     TopicArn: topicArn,
//     Message: message,
//   };
//   await sns.publish(params).promise();
// };

exports.subscribeEmail = async (email) => {
    const params = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: email,
    };
  
    return sns.subscribe(params).promise();
  };

  exports.unsubscribeEmailByEmail = async (email) => {
    const params = {
      TopicArn: topicArn,
    };
  
    const response = await sns.listSubscriptionsByTopic(params).promise();
  
    const subscription = response.Subscriptions.find(sub => sub.Endpoint === email);
  
    if (!subscription) {
      throw new Error(`Subscription not found for email: ${email}`);
    }
  
    if (subscription.SubscriptionArn === 'PendingConfirmation') {
      throw new Error(`Subscription for ${email} is still pending confirmation`);
    }
  
    const unsubscribeParams = {
      SubscriptionArn: subscription.SubscriptionArn,
    };
  
    return sns.unsubscribe(unsubscribeParams).promise();
  };