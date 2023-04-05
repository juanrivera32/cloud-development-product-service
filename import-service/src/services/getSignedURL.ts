import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
});

const s3 = new AWS.S3();

const myBucket = process.env.IMPORT_BUCKET_NAME;
const signedUrlExpireSeconds = 3600;

export const getSignedUrl = (fileName: string) => {
  const url = s3.getSignedUrl('putObject', {
    Bucket: myBucket,
    Key: `uploaded/${fileName}`,
    Expires: signedUrlExpireSeconds,
    'ContentType': 'text/csv'
  });

  console.log('inside th services/getSignedUrl: ', url);

  return url;
};
