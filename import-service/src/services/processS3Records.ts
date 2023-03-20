import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

AWS.config.update({
  region: 'us-east-1',
});

const s3 = new AWS.S3();
const sqsClient = new AWS.SQS();

const myBucket = process.env.IMPORT_BUCKET_NAME;
const queueUrl = process.env.QUEUE_URL;

export const processS3Records = async (objectKey) => {
  try {
    const s3ResponseStream = s3
      .getObject({ Bucket: myBucket, Key: objectKey })
      .createReadStream();

    console.log(`>>>>>> Starting parsing process for ${objectKey}...`);

    const data = s3ResponseStream.pipe(csvParser({ separator: ';' }));

    for await (const chunk of data) {
      const body = JSON.stringify(chunk);
      console.log('Sending record to SQS...');
      const sqsRes = await sqsClient
        .sendMessage({ DelaySeconds: 0, MessageBody: body, QueueUrl: queueUrl })
        .promise();
      console.log(`Message ${sqsRes.MessageId} sent successfully `);
    }
  } catch (e) {
    console.log(e);
  }
};
