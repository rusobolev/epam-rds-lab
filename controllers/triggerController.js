const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { Buffer } = require('buffer');

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const triggerConsistencyCheck = async (req, res) => {
  console.log('➡️ Triggering Lambda and retrieving logs');

  try {
    const command = new InvokeCommand({
      FunctionName: 'epamASobolev-DataConsistencyFunction',
      InvocationType: 'RequestResponse', 
      LogType: 'Tail', 
    });

    const response = await lambdaClient.send(command);

    const logs = Buffer.from(response.LogResult, 'base64').toString('utf8');
    console.log('📝 Lambda logs:\n', logs);

    res.status(200).json({
      message: 'Lambda executed successfully',
      statusCode: response.StatusCode,
      logs: logs,
    });
  } catch (error) {
    console.error('❌ Failed to invoke Lambda:', error);
    res.status(500).json({ error: 'Failed to invoke Lambda', details: error.message });
  }
};

module.exports = { triggerConsistencyCheck };
