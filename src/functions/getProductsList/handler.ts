import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsJSON from '@libs/mockProducts.json';

type Products = typeof productsJSON;

const getProducts: () => Promise<Products> = () => Promise.resolve(productsJSON);


const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const products = await getProducts();

    if (!products.length) {
      return formatJSONResponse({
        statusCode: 404,
        event,
        products,
      });
    }

    return formatJSONResponse({
      statusCode: 200,
      event,
      products,
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 500,
      event,
      error: `Internal server error: ${error}`
    })
  }

};

export const main = middyfy(getProductsList);
