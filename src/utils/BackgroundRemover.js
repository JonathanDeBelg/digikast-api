const axios = require('axios');
const FormData = require('form-data');

const apiUrl = '/v1/convert/';
const resultsUrl = '/v1/results/';

const instance = axios.create({
  baseUrl: 'https://api.backgroundremover.app',
  headers: {
    Authorization: '71ef2f04ffee421a9d392eb3512d00d2',
  },
});

const removeBackground = async (req) => {
  const bodyFormData = new FormData();
  bodyFormData.append('files', req.buffer, req.originalname);
  bodyFormData.append('lang', 'en');
  bodyFormData.append('convert_to', 'image-backgroundremover');

  try {
    const response = await instance.post(`https://api.backgroundremover.app${apiUrl}`, bodyFormData, {
      headers: bodyFormData.getHeaders(),
    });

    return response.data;
  } catch (err) {
    console.log(instance);
    console.error(`bg rem error: ${err}`);
  }
};

async function downloadImageFromSource(url) {
  try {
    // const response = await instance.get(`https://api.backgroundremover.app/${url}`);
    // return response.data;
    return instance
      .get(`https://api.backgroundremover.app/${url}`, {
        responseType: 'arraybuffer',
      })
      .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
  } catch (err) {
    console.error(`bg rem error: ${err}`);
  }
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function downloadImage(upload) {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append('uuid', upload.uuid);
    print("getting image");
    const response = await instance.post(`https://api.backgroundremover.app${resultsUrl}`, bodyFormData, {
      headers: bodyFormData.getHeaders(),
    });
    if (response.data.finished !== true) {
      delay(5000);
      return downloadImage(upload);
    } else {
      return await downloadImageFromSource(response.data.files[0].url);
    }
  } catch (err) {
    console.error(`bg rem error: ${err}`);
  }
}

const processBackgroundRemoval = async (file) => {
  try {
    const upload = await removeBackground(file);
    console.log(upload);
    if (upload !== null) {
      return await downloadImage(upload);
    }
  } catch (e) {
    console.error(`Error during background removal: ${e}`);
  }
};

module.exports = {
  processBackgroundRemoval,
};
