const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const { registerMailTemplate } = require('../../assets/emails/register');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text, template: 'register' };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendRegisterEmail = async (user) => {
  const subject = 'Aanmelding voor Digikast';
  const text = `Hallo ${user.name},

Wat leuk dat je een account hebt aangemaakt bij Digikast.
Vanaf nu wordt het organiseren van je kleding een stuk gemakkelijker!

Ga snel aan de slag met het digitaliseren van je eigen kast.
Weten hoe Digikast precies werkt? Open dan het linkje voor een
uitgebreide handleiding. Hierin vind je onder andere hoe je
kasten/koffers, kledingstukken en outfits moet toevoegen. (link naar de site met de uitleg en filmpje)

Nogmaals zijn wij blij je te verwelkomen bij Digikast, als er vragen
zijn dan staan wij voor je klaar via info@digikast.nl!


Met vriendelijke kledinggroet,
Team Digikast`;
  const message = {
    to: user.email,
    subject,
    text,

    html: await registerMailTemplate(user.name),

    attachments: [
      {
        filename: 'logo.png',
        path: `${__dirname}/../../assets/img/logo.png`,
        cid: 'logo',
      },
    ],
  };

  await transport.sendMail(message, (error, info) => {
    if (error) {
      console.log("Emailadress not known");
    }
  });
};

const sendTestEmail = async (user) => {
  const subject = 'Aanmelding voor Digikast';
  const text = `Hallo ${user},

Wat leuk dat je een account hebt aangemaakt bij Digikast.
Vanaf nu wordt het organiseren van je kleding een stuk gemakkelijker!

Ga snel aan de slag met het digitaliseren van je eigen kast.
Weten hoe Digikast precies werkt? Open dan het linkje voor een
uitgebreide handleiding. Hierin vind je onder andere hoe je
kasten/koffers, kledingstukken en outfits moet toevoegen. (link naar de site met de uitleg en filmpje)

Nogmaals zijn wij blij je te verwelkomen bij Digikast, als er vragen
zijn dan staan wij voor je klaar via info@digikast.nl!


Met vriendelijke kledinggroet,
Team Digikast`;
  const message = {
    to: user,
    subject,
    text,

    html: await registerMailTemplate(user),

    attachments: [
      {
        filename: 'logo.png',
        path: `${__dirname}/../../assets/img/logo.png`,
        cid: 'logo',
      },
    ],
  };

  await transport.sendMail(message, (error, info) => {
    if (error) {
      return process.exit(1);
    }
  });
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendRegisterEmail,
  sendTestEmail,
};
