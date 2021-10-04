const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadFile = async (req) => {    
    const params = {
        Bucket: 'digikast',
        Key: req.user.id + '/' + req.file.originalname,
        Body: JSON.stringify(req.file.buffer, null, 2)
    };

    return s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        filePath = data.Location;
    }).promise()
};

module.exports = uploadFile;
