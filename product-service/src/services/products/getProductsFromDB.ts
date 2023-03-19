import { Product } from './Product';
import { dynamoDBClient } from './dynamoClient';

const productsTableName = process.env.PRODUCTS_TABLE_NAME;
const stocksTableName = process.env.STOCKS_TABLE_NAME;

const scanProducts = async () => {
  const products = await dynamoDBClient
    .scan({
      TableName: productsTableName,
      Select: 'ALL_ATTRIBUTES',
    })
    .promise();

  return products;
};

const scanStocks = async () => {
  const stocks = await dynamoDBClient
    .scan({
      TableName: stocksTableName,
      Select: 'ALL_ATTRIBUTES',
    })
    .promise();

  return stocks;
};

const getProducts = async () => {
  try {
    const [products, stocks] = await Promise.all([scanProducts(), scanStocks()]);
    const productItems = products.Items;
    const stockItems = stocks.Items;
  
    const stockedProducts = productItems.reduce((acc, val) => {
      const { id } = val;
      const stock = stockItems.find((el) => el.product_id === id)?.stock;
      const finalProduct = {
        ...val,
        stock: stock || undefined,
      };
      acc.push(finalProduct);
      return acc;
    }, []);
    return stockedProducts as Product[];
  } catch (error) {
    return Promise.reject('Internal server error');
  }
};

export { getProducts };
