import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        documentation: {
          summary: 'getProductsList',
          description: 'Get products list',
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: 'Product list',
              },
              responseModels: {
                'application/json': 'Product'
              },
            },
            {
              statusCode: 500,
              responseBody: {
                description: 'Internal server error',
              },
              responseModels: {
                'application/json': 'ErrorResponse'
              },
            }
          ]
        }
      },
    },
  ],
};
