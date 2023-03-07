import { Product } from './Product';
import { dynamoDBClient } from './dynamoClient';
import { Stock } from './Stock';

const productsTableName = process.env.PRODUCTS_TABLE_NAME;
const stocksTableName = process.env.STOCKS_TABLE_NAME;

const queryProduct = async (id: string) => {
  const products = await dynamoDBClient
    .query({
      TableName: productsTableName,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': id,
      },
      KeyConditionExpression: '#id = :id',
    })
    .promise();

  return products;
};

const queryStock = async (id: string) => {
  const stocks = await dynamoDBClient
    .query({
      TableName: stocksTableName,
      ProjectionExpression: 'stock',
      ExpressionAttributeValues: {
        ':id': id,
      },
      KeyConditionExpression: 'product_id = :id',
    })
    .promise();

  return stocks;
};

const getProductById = async (id: string) => {
  const [products, stocks] = await Promise.all([
    queryProduct(id),
    queryStock(id),
  ]);
  const productItem = products.Items[0] as Product;
  const { stock } = stocks.Items[0] as Stock;

  const product = {
    ...productItem,
    count: stock,
  };

  return product;
};

export { getProductById };
