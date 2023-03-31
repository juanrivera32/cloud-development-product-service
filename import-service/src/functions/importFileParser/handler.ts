import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { processS3Records } from 'src/services/processS3Records';

const processS3RecordsHandler: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  // @ts-ignore
  for (const record of event.Records) {
    await processS3Records(record.s3.object.key);
    console.log(`Parsed ${record.s3.object.key} successfully`);
  }

  return formatJSONResponse({
    statusCode: 200,
    response: `success`,
  });
};

export const main = middy(processS3RecordsHandler).use(inputOutputLogger());
