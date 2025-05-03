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

    const rawLog = Buffer.from(response.LogResult, 'base64').toString('utf8');
    const logLines = rawLog.split('\n').filter(Boolean); 

    console.log('📝 Lambda logs:\n', logLines.join('\n'));

    res.status(200).json({
      message: 'Lambda executed successfully',
      statusCode: response.StatusCode,
      logs: logLines, 
    });
  } catch (error) {
    console.error('❌ Failed to invoke Lambda:', error);
    res.status(500).json({ error: 'Failed to invoke Lambda', details: error.message });
  }
};

module.exports = { triggerConsistencyCheck };
