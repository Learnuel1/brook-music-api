const path = require("path")
const { domainMail, mailAuth } = require("./mail.auth");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const config = require("../config/env");
const { App_CONFIG } = require("../config");

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
      from: `${App_CONFIG.APP_NAME} ${domainMail.mail()}`,
      to: sendTo,
      subject,
      template: "registration",
      context: { 
        username, 
        title, 
        team, 
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
        transporter.sendMail(mail, (err) => {
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
const passwordMailOptions = (sendTo, subject, uniqueString, title, message, team, otp) => {
  return {
    from: `${App_CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject,
    template: "password_recovery",
    context: { 
      link: otp? " ": `${config.FRONTEND_ORIGIN_URL}/password-recovery?ref=${uniqueString}`,
      company: `${App_CONFIG.APP_NAME}`,
      title,
      message, 
      team,
      buttonText: otp? otp: "Reset Password",
    },
  };
};

exports.recoveryPasswordMailHandler = async (
  email, 
  subject, uniqueString, title, message,team, otp
) => {
  return new Promise((resolve, reject) => {
    const mail = passwordMailOptions(
      email,
      subject, uniqueString, title, message,team, otp
    );
    transporter.sendMail(mail, (err) => {
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
    from: `${App_CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject, 
    html: message,
    attachments:attachment,
  };
};
exports.sendEMailHandler = (sendTo, subject, message, attachment=null)=> {
  return new Promise((resolve, reject) => {
    const mail = sendEmailOptions(
      sendTo, subject, message, attachment
    );
    transporter.sendMail(mail, (err) => {
      if (err) { 
        return reject(err);
      }
      return resolve({ success: true });
    });
  });
}
 