import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createProductImpl } from 'src/services/products/createProductImpl';
import { Product } from 'src/services/products/Product';


const createProduct: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  try {
    console.log(event);
    const productData: Partial<Product> = event.body;
    const response = await createProductImpl(productData);

    console.log(response)
    
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
