import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { processMessages } from 'src/services/catalog/processMessages';



const catalogBatchProcessHandler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  // @ts-ignore
  for (const record of event.Records) {
    const { body } = record;
    // call service
    await processMessages(body);
  }

  return formatJSONResponse({
    statusCode: 200,
    response: '',
  });
};

export const main = middy(catalogBatchProcessHandler).use(inputOutputLogger());
