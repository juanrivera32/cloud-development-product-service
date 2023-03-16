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
  try {
    const s3ResponseStream = s3
      .getObject({ Bucket: myBucket, Key: objectKey })
      .createReadStream();

    console.log(`>>>>>> Starting parsing process for ${objectKey}...`);

    const data = s3ResponseStream.pipe(csvParser({ separator: ';' }));
    const chunks = [];
    for await (const chunk of data) {
      chunks.push(chunk);
      console.log('chunk ---- ', JSON.stringify(chunk));
    }

    return chunks;
  } catch (e) {
    console.log(e);
  }
};
