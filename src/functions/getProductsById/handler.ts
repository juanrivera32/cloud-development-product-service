import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '@libs/mockProducts.json';

type Product = typeof products[0];

const findProduct = (productId: string): Promise<Product> => {
  const product = products.find(product => product.id === productId);

  if (!product) return Promise.resolve(undefined);
  return Promise.resolve(product);
}

const getProductsById: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const productId = event.path.split('/').filter(Boolean)[1];
    const product = await findProduct(productId);

    if (!product) {
      return formatJSONResponse({
        statusCode: 404,
        event,
        message: `Product ${productId} was not found`
      });
    }
    
    return formatJSONResponse({
      statusCode: 200,
      event,
      product
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 404,
      event,
      message: `Internal server error. Try again later: ${error}`,
    });
  }

};

export const main = middyfy(getProductsById);
