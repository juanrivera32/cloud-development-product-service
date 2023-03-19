import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getSignedUrl } from 'src/services/getSignedURL';

// @ts-ignore
const createSignedURL: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  const fileName = event.queryStringParameters.name;
  const url = getSignedUrl(fileName);

  // return url
  return formatJSONResponse({
    statusCode: 200,
    response: url,
  });
};

export const main = middyfy(createSignedURL);
