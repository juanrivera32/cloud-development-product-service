import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import type { Product } from 'src/services/products/Product';
import { getProducts } from 'src/services/products/getProductsFromDB';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    const products: Product[] = await getProducts();

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
