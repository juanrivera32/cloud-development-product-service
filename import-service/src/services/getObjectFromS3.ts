import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

AWS.config.update({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS,
  },
});

const s3 = new AWS.S3();

const myBucket = process.env.IMPORT_BUCKET_NAME;

export const getObjectFromS3 = async (objectKey) => {
  console.log('ObjectKey', objectKey);

  const s3ResponseStream = s3
    .getObject({ Bucket: myBucket, Key: objectKey }).createReadStream()

  console.log('s3ResponseStream', s3ResponseStream)

  const chunks = [];

  s3ResponseStream
    .pipe(csvParser())
    .on('data', async (data) => {
      console.log('hi, this is a chunk: ', data);
      chunks.push(data);
    })
    .on('end', () => console.log('logged successfully', chunks))
    .on('error', (e) => console.log('error reading: ', e))
    .on('readable', (r) => console.log('readable: ', r));
};
