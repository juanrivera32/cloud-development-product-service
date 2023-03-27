import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { isValidUser } from 'src/services/auth';



const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const authHeader: string = event.headers.Authorization;
    
    if (!authHeader) {
      return formatJSONResponse({
        statusCode: 401,
        response: 'Authorization header is not provided.'
      });
    }

    if (!isValidUser(authHeader)) {
      return formatJSONResponse({
        statusCode: 403,
        response: 'Invalid user'
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      response: 'Success'
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 500,
      message: `Internal server error: ${error}`
    })
  }

};

export const main = middyfy(getProductsList);
