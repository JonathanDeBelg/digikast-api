const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const removeBackground = async (req) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', req.file.buffer, req.file.originalname);

  try {
    const response = await axios.post(process.env.BACKGROUND_REM_URL, bodyFormData, {
      headers: bodyFormData.getHeaders(),
      auth: {
        username: 'admin',
        password: 'Admin!123',
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  removeBackground,
};
