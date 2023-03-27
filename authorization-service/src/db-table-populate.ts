import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import mockProducts from './libs/mockProducts.json'
AWS.config.update({ region: 'us-east-1' });
const credentials = new AWS.SharedIniFileCredentials({ profile: 'juanguillermo' });

AWS.config.credentials = credentials;

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

mockProducts.forEach(product => {
  const productId = uuidv4();
  const productParams: AWS.DynamoDB.PutItemInput = {
    TableName: 'products',
    Item: {
      id: { S: productId },
      title: { S: product.title },
      description: { S: product.description },
      price: { N: `${product.price}` }
    }
  }

  ddb.putItem(productParams, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })

  const stocksParams: AWS.DynamoDB.PutItemInput = {
    TableName: 'stocks',
    Item: {
      product_id: { S: productId },
      stock: { N: '5' }
    }
  }

  ddb.putItem(stocksParams, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
})



