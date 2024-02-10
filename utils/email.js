const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = '"GLANCE Technic E-commerce" <no-reply@glance-tech.com>';
  }
  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const path = require('path');
    const templatePath = path.resolve(
      __dirname,
      '..',
      'pug',
      'email',
      'template',
      `${template}.pug`,
    );

    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      html,
      text: htmlToText.htmlToText(html),
    };

    await this.newTransporter().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to GLANCE shop!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset link valid for 10 minutes.',
    );
  }
};
