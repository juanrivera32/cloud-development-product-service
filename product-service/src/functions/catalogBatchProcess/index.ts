import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:us-east-1:029589388983:catalogItemsQueue',
        batchSize: 5,
      },
    },
  ],
};
