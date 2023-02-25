import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@libs/mockProducts.json';


const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const path = event.path;
  const productId = path.split('/').filter(Boolean)[1];
  const product = products.find(product => product.id === productId);

  return formatJSONResponse({
    event,
    product
  });
};

export const main = middyfy(getProductsById);
