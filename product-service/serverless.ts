import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-openapi-documentation', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    iamManagedPolicies: [
      `arn:aws:iam::${process.env.ACCOUNT_ID}:policy/LambdaDynamoPolicy`,
      `arn:aws:iam::${process.env.ACCOUNT_ID}:policy/LambdaPublishToSNS`
    ],
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
      PRODUCTS_TABLE_NAME: 'products',
      STOCKS_TABLE_NAME: 'stocks',
      ACCESS_KEY: process.env.ACCESS_KEY,
      SECRET_ACCESS: process.env.SECRET_ACCESS,
      CATALOG_ITEMS_QUEUE: process.env.CATALOG_ITEMS_QUEUE,
      EMAIL_SUBSCRIPTION_ENDPOINT: process.env.EMAIL_SUBSCRIPTION_ENDPOINT,
      CREATE_PRODUCT_TOPIC_ARN: process.env.CREATE_PRODUCT_TOPIC_ARN,
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
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
    documentation: {
      version: '1',
      title: 'Products Service API',
      description:
        'This is the products service API used for the AWS Practitioner for JS course.',
      models: [
        {
          name: 'ErrorResponse',
          description: 'This is an error',
          contentType: 'application/json',
          schema: `${__dirname}/models/ErrorResponse.json`,
        },
        {
          name: 'Product',
          description: 'Schema for product definition',
          contentType: 'application/json',
          schema: `${__dirname}/models/Product.json`,
        },
      ],
    },
  },
  resources: {
    Resources: {
      stocks: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'products',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
          VisibilityTimeout: 600,
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'CreateProductTopic',
          TopicName: 'CreateProductTopic',
        },
      },
      createProductTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.EMAIL_SUBSCRIPTION_ENDPOINT,
          Protocol: 'email',
          TopicArn : { "Ref" : "CreateProductTopic" }
        }
      }
    },
  },
  // configValidationMode: 'error'
};

module.exports = serverlessConfiguration;
