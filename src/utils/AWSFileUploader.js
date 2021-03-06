const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_BUCKET_ACCESS,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const uploadFile = async (file, req) => {
  const buf = Buffer.from(file, 'base64');
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${req.user.id}/${req.file.originalname}.jpeg`,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: `image/jpeg`,
  };

  return s3
    .upload(params, function (s3Err, data) {
      if (s3Err) {
        console.log('Got error:', s3Err.message);
        console.log('Request:');
        console.log(this.request.httpRequest);
        console.log('Response:');
        console.log(this.httpResponse);
      }
      filePath = data.Location;
    })
    .promise();
};

const removeFile = async (filePath, userID) => {
  const params = {
    Bucket: 'digikast',
    Key: `${userID.id}/${filePath.split('/').pop()}`,
  };

  try {
    s3.deleteObject(params, function (s3Err, data) {
      if (s3Err) {
        console.log('Got error:', s3Err.message);
        console.log('Request:');
        console.log(this.request.httpRequest);
        console.log('Response:');
        console.log(this.httpResponse);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  uploadFile,
  removeFile,
};
