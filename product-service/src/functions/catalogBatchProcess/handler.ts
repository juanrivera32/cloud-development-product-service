import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  // @ts-ignore
  event.Records.forEach(record => {
    const { body } = record;
    console.log('<> - ', body);
  });

  return formatJSONResponse({
    statusCode: 200,
    response: '',
  });
};

export const main = middy(catalogBatchProcess).use(inputOutputLogger());
