import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from './mockProducts.json';


const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  return formatJSONResponse({
    event,
    products,
  });
};

export const main = middyfy(getProductsList);
