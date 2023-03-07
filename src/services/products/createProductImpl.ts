import { Product } from './Product';
import { dynamoDBClient } from './dynamoClient';
import { v4 as uuidv4 } from 'uuid';
const productsTableName = process.env.PRODUCTS_TABLE_NAME;

const createProduct = async (product: Partial<Product>) => {
  const res = await dynamoDBClient.put({
    TableName: productsTableName,
    Item: {
      id: uuidv4(),
      title: product.title,
      description: product.description,
      price: product.price,
    },
  }).promise();

  return res;
};

const createProductImpl = async (product: Partial<Product>) => {
  try {
    await createProduct(product);
    const message = `Product ${product.title} created successfully`
    return message;

  } catch (e) {
    console.log('Error while creating a product: ', e);
  }
}

export { createProductImpl }
