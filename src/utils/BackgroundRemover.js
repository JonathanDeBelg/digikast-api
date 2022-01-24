const axios = require('axios')

const removeBackground = async(req) => {
    // process.env
    axios
        .post(process.env.BACKGROUND_REM_URL, {
            image: req.file.buffer
        }).promise();

    return s3.upload(params, function(s3Err, data) {
        if (s3Err) {
            console.log("Got error:", s3Err.message);
            console.log("Request:");
            console.log(this.request.httpRequest);
            console.log("Response:");
            console.log(this.httpResponse);
        }
        filePath = data.Location;
    }).promise()
};

module.exports = {
    removeBackground
}