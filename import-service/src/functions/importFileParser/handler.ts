import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { getObjectFromS3 } from 'src/services/getObjectFromS3';

// @ts-ignore
const getObjectFromS3Handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  // @ts-ignore
  await getObjectFromS3(event.Records[0].s3.object.key);
  // return url
  return formatJSONResponse({
    statusCode: 200,
    response: 'success',
  });
};


export const main = middy(getObjectFromS3Handler).use(inputOutputLogger())

