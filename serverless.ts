import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-openapi-documentation', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
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
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
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
      description: 'This is the products service API used for the AWS Practitioner for JS course.',
      models: [
        {
          name: 'ErrorResponse',
          description: 'This is an error',
          contentType: 'application/json',
          schema: `${__dirname}/models/ErrorResponse.json`
        },
        {
          name: 'Product',
          description: 'Schema for product definition',
          contentType: 'application/json',
          schema: `${__dirname}/models/Product.json`
        }
      ]
    }
  },
  // configValidationMode: 'error'
};

module.exports = serverlessConfiguration;
