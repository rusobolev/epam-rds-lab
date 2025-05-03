const sqsService = require('./services/sqsService');
//const snsService = require('./services/snsService');

const pollMessages = async () => {
  try {
    const messages = await sqsService.receiveMessages();

    for (const message of messages) {
      const body = JSON.parse(message.Body);

      const notificationText = `
Image uploaded!
Name: ${body.name}
Size: ${body.size} bytes
Extension: ${body.extension}
Download link: ${body.downloadUrl}
      `;

//      await snsService.publishNotification(notificationText);

      await sqsService.deleteMessage(message.ReceiptHandle);
    }
  } catch (error) {
    console.error('Error processing messages from SQS:', error);
  }
};

setInterval(pollMessages, 60000);
