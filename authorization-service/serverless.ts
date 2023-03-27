import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ACCESS_KEY: process.env.ACCESS_KEY,
      SECRET_ACCESS: process.env.SECRET_ACCESS,
      ACCOUNT_ID: process.env.ACCOUNT_ID,
      AUTH_USER: process.env.AUTH_USER,
    },
  },
  // import the function via paths
  functions: {
    basicAuthorizer,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  // resources: {
  //   Resources: {
  //     stocks: {
  //       Type: 'AWS::DynamoDB::Table',
  //       Properties: {
  //         TableName: 'stocks',
  //         AttributeDefinitions: [
  //           {
  //             AttributeName: 'product_id',
  //             AttributeType: 'S',
  //           },
  //         ],
  //         KeySchema: [
  //           {
  //             AttributeName: 'product_id',
  //             KeyType: 'HASH',
  //           },
  //         ],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: 1,
  //           WriteCapacityUnits: 1,
  //         },
  //       },
  //     },
  //     products: {
  //       Type: 'AWS::DynamoDB::Table',
  //       Properties: {
  //         TableName: 'products',
  //         AttributeDefinitions: [
  //           {
  //             AttributeName: 'id',
  //             AttributeType: 'S',
  //           },
  //         ],
  //         KeySchema: [
  //           {
  //             AttributeName: 'id',
  //             KeyType: 'HASH',
  //           },
  //         ],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: 1,
  //           WriteCapacityUnits: 1,
  //         },
  //       },
  //     },
  //     catalogItemsQueue: {
  //       Type: 'AWS::SQS::Queue',
  //       Properties: {
  //         QueueName: 'catalogItemsQueue',
  //         VisibilityTimeout: 600,
  //       },
  //     },
  //     CreateProductTopic: {
  //       Type: 'AWS::SNS::Topic',
  //       Properties: {
  //         DisplayName: 'CreateProductTopic',
  //         TopicName: 'CreateProductTopic',
  //       },
  //     },
  //     createProductTopicSubscription: {
  //       Type: 'AWS::SNS::Subscription',
  //       Properties: {
  //         Endpoint: process.env.EMAIL_SUBSCRIPTION_ENDPOINT,
  //         Protocol: 'email',
  //         TopicArn : { "Ref" : "CreateProductTopic" }
  //       }
  //     }
  //   },
  // },
};

module.exports = serverlessConfiguration;
