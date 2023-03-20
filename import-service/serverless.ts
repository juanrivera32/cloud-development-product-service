import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    iamManagedPolicies: [
      `arn:aws:iam::${process.env.ACCOUNT_ID}:policy/LambdaS3AccessPolicy`,
      `arn:aws:iam::${process.env.ACCOUNT_ID}:policy/WriteToSQS`
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
      ACCESS_KEY: process.env.ACCESS_KEY,
      SECRET_ACCESS: process.env.SECRET_ACCESS,
      IMPORT_BUCKET_NAME: process.env.IMPORT_BUCKET_NAME,
      CATALOG_ITEMS_QUEUE: process.env.CATALOG_ITEMS_QUEUE,
      QUEUE_URL: process.env.QUEUE_URL
    },
  },
  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser,
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
};

module.exports = serverlessConfiguration;
