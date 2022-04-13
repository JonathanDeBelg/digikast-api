const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const removeBackground = async (req) => {
  const bodyFormData = new FormData();
  bodyFormData.append('image', req.buffer, req.originalname);
  bodyFormData.append('mode', 'image');
  bodyFormData.append('background_color', '#FFFFFF');
  bodyFormData.append('format', 'jpg');
  bodyFormData.append('background_fit_to_result', 'true');

  try {
    return await axios({
      method: 'post',
      url: 'https://api.photoscissors.com/v1/change-background',
      data: bodyFormData,
      responseType: 'arraybuffer',
      headers: {
        ...bodyFormData.getHeaders(),
        'X-Api-Key': 'WRXAT7D-3HY4ZWT-P63PBYS-Y48F4GX',
      },
    })
      .then((response) => {
        if (response.status != 200) return console.error('Error:', response.status, response.statusText);
        return response.data;
      })
      .catch((error) => {
        return console.error('Request failed:', error);
      });
    // const response = await axios.post(`https://api.photoscissors.com/v1/change-background`, bodyFormData, {
    //   headers: {
    //     ...bodyFormData.getHeaders(),
    //     'X-Api-Key': 'WRXAT7D-3HY4ZWT-P63PBYS-Y48F4GX',
    //   },
    // });
    //
    //   // return Buffer.from(response.data, 'binary').toString('base64');
    // // return response.data;
  } catch (err) {
    console.error(`bg rem error: ${err}`);
  }
};

module.exports = {
  removeBackground,
};
