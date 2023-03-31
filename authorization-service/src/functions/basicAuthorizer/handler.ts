import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { isValidUser, generateResponse } from 'src/services/auth';

export const main = async (
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
    const authHeader: string = event.headers.Authorization;
    console.log(JSON.stringify(event));
    const { methodArn } = event;
    const response = isValidUser(authHeader)
      ? generateResponse('testPrincipal', 'Allow', methodArn)
      : generateResponse('testPrincipal', 'Deny', methodArn);

    return response;
};

