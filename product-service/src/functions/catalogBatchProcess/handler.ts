import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  // @ts-ignore
  event.Records.forEach(record => {
    const { body } = record;
    console.log(body);
  });

  return formatJSONResponse({
    statusCode: 200,
    response: '',
  });
};

export const main = middyfy(catalogBatchProcess);
