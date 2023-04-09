import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              name: true,
            }
          }
        },
        cors: true,
        authorizer: {
          arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:function:authorization-service-dev-basicAuthorizer`,
          type: 'request',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 1,
        }
      },
    },
  ],
};
