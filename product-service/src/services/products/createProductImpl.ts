import { Product } from './Product';
import { dynamoDBClient } from './dynamoClient';
import { v4 as uuidv4 } from 'uuid';

const productsTableName = process.env.PRODUCTS_TABLE_NAME;
const stocksTableName = process.env.STOCKS_TABLE_NAME;

const createProduct = async (product: Product) => {
  const itemId = uuidv4();
  const res = await Promise.all([
    dynamoDBClient
      .put({
        TableName: productsTableName,
        Item: {
          id: itemId,
          title: product.title,
          description: product.description,
          price: product.price,
        },
      })
      .promise(),
    dynamoDBClient.put({
      TableName: stocksTableName,
      Item: {
        product_id: itemId,
        stock: product.stock,
      },
    }).promise(),
  ]);

  return res;
};

const createProductImpl = async (product: Product) => {
  try {
    await createProduct(product);
    const message = `Product ${product.title} created successfully`;
    return message;
  } catch (e) {
    return Promise.reject(`Error while creating a product: ${e}`);
  }
};

export { createProductImpl };
