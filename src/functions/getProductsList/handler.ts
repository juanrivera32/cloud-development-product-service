import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsJSON from '@libs/mockProducts.json';
import type { Product } from 'src/models/Product';

const getProducts: () => Promise<Product[]> = () => Promise.resolve(productsJSON);


const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    const products = await getProducts();

    if (!products.length) {
      return formatJSONResponse({
        statusCode: 404,
        products,
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      products,
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 500,
      message: `Internal server error: ${error}`
    })
  }

};

export const main = middyfy(getProductsList);
