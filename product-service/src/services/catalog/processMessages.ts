import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
});

const createTopicArn = process.env.CREATE_PRODUCT_TOPIC_ARN;
const snsClient = new AWS.SNS();

export const processMessages = async (message: string): Promise<void> => {
  try {
    const res = await snsClient.publish(({ Message: message, TopicArn: createTopicArn })).promise();
    console.log(`Message ${res.MessageId} sent to topic successfully`);
  } catch (error) {
    console.log('Unable to send message to SNS topic: ', error);
  }
} 