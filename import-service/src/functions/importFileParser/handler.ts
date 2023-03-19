import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { getObjectFromS3 } from 'src/services/getObjectFromS3';

const getObjectFromS3Handler: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  // @ts-ignore
  for (const record of event.Records) {
    await getObjectFromS3(record.s3.object.key);
    console.log(`Parsed ${record.s3.object.key} successfully`);
  }

  return formatJSONResponse({
    statusCode: 200,
    response: `success`,
  });
};

export const main = middy(getObjectFromS3Handler).use(inputOutputLogger());
