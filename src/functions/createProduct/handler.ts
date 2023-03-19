import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createProductImpl } from 'src/services/products/createProductImpl';
import { Product } from 'src/services/products/Product';


const createProduct: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    const productData: Partial<Product> = event.body;

    if (!productData.title || !productData.description || !productData.price) {
      return formatJSONResponse({
        statusCode: 400,
        response: 'Invalid data: one or more attributes are missing'
      });
    }

    const response = await createProductImpl(productData);
    
    return formatJSONResponse({
      statusCode: 200,
      response
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 404,
      message: `Internal server error. Try again later: ${error}`,
    });
  }

};

export const main = middyfy(createProduct);
