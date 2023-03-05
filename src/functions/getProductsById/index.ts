import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        request: {
          parameters: {
            paths: {
              productId: true,
            }
          }
        },
        documentation: {
          summary: 'getProductsById',
          description: 'Get product details for a given product id',
          pathParams: [
            {
              name: "productId",
              description: "The product id to look for",
              schema: {
                type: "string",
                pattern: "^[-a-z0-9_]+$"
              }
            }
          ],
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: 'Product details for the given id',
              },
              responseModels: {
                'application/json': 'Product'
              },
            },
            {
              statusCode: 404,
              responseBody: {
                description: 'Product not found',
              },
              responseModels: {
                'application/json': 'ErrorResponse'
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
