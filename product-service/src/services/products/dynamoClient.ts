import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS,
  },
});

const ddb = new AWS.DynamoDB.DocumentClient();

export { ddb as dynamoDBClient };
