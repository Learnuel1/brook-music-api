const path = require("path")
const { domainMail, mailAuth } = require("./mail.auth");
const { CONFIG, CONSTANTS } = require("../../config");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const config = require("../../config/env");

const handlebarsOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./src/views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/views"),
  extName: ".handlebars",
};
let transporter = nodemailer.createTransport(
  {
    ...mailAuth
  });

  transporter.use("compile", hbs(handlebarsOptions));


  //Registration completed
   const registrationMailOptions = (sendTo, subject, username, userType, team ="team", title) => {
    return {
      from: `${CONFIG.APP_NAME} ${domainMail.mail()}`,
      to: sendTo,
      subject,
      template: "registration",
      context: { 
        username, 
        title, 
        team,
        facebook:`${config.FACEBOOK}`,
        x:`${config.X}`,
        linkedin:`${config.LINKEDIN}`,
        instagram:`${config.INSTAGRAM}`,
        unsubscribe:`${config.FRONTEND_ORIGIN_URL}/unsubscribe?email=${sendTo}`,
        home:`${config.FRONTEND_ORIGIN_URL}/home`,
        login:`${config.FRONTEND_ORIGIN_URL}/login`,
        contact:`${config.FRONTEND_ORIGIN_URL}/contact-us`,
        supportEmail:`${config.SUPPORT_EMAIL}`, 
        downloadLink: `${userType === CONSTANTS.ACCOUNT_TYPE[0] || userType === CONSTANTS.ACCOUNT_TYPE[2] ? "block" : "none"}`
      },
    };
  };

  exports.registrationMailHandler = async (email, username, userType, grubbexDept, title) => {
    try {
      return new Promise((resolve, reject) => {
        const mail = registrationMailOptions(
          email,
          "Account Registration",
          username,
          userType, grubbexDept, title
        );
        transporter.sendMail(mail, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve({ success: true });
        });
      });
    } catch (error) {
      return { error: error };
    }
  };
  
// password recovery
const passwordMailOptions = (sendTo, subject, uniqueString, title, message,grubbexDept, otp) => {
  return {
    from: `${CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject,
    template: "password_recovery",
    context: { 
      link: otp? " ": `${config.FRONTEND_ORIGIN_URL}/password-recovery?ref=${uniqueString}`,
      company: `${CONFIG.APP_NAME}`,
      title,
      message,
      grubbexDept,
      buttonText: otp? otp: "Reset Password",
      website:`${config.FRONTEND_ORIGIN_URL}`,
      facebook:`${config.FACEBOOK}`,
      x:`${config.X}`,
      linkedin:`${config.LINKEDIN}`,
      instagram:`${config.INSTAGRAM}`
    },
  };
};

exports.recoveryPasswordMailHandler = async (
  email, 
  subject, uniqueString, title, message,grubbexDept, otp
) => {
  return new Promise((resolve, reject) => {
    const mail = passwordMailOptions(
      email,
      subject, uniqueString, title, message,grubbexDept, otp
    );
    transporter.sendMail(mail, (err, data) => {
      if (err) { 
        return reject(err);
      }
      return resolve({ success: true });
    });
  });
};







// GENERAL EMAIL 
const sendEmailOptions = (sendTo, subject, message, attachment) => {
  return {
    from: `${CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject,
    // text: message,
    html: message,
    attachments:attachment,
  };
};
exports.sendEMailHandler = (sendTo, subject, message, attachment=null)=> {
  return new Promise((resolve, reject) => {
    const mail = sendEmailOptions(
      sendTo, subject, message, attachment
    );
    transporter.sendMail(mail, (err, data) => {
      if (err) { 
        return reject(err);
      }
      return resolve({ success: true });
    });
  });
}
 