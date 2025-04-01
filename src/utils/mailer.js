const path = require("path")
const { domainMail, mailAuth } = require("./mail.auth");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { App_CONFIG } = require("../config");
const config = require("../config/env");

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
const passwordMailOptions = (sendTo, subject,  title, time, otp, name) => {
  return {
    from: `${App_CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject,
    template: "password_recovery",
    context: { 
      OTP:otp,
      appName: `${App_CONFIG.APP_NAME}`,
      title, 
      time,
      firstName :name,
    },
  };
};

exports.recoveryPasswordMailHandler = async (
  email, 
  subject, title, time, otp, name
) => {
  return new Promise((resolve, reject) => {
    const mail = passwordMailOptions(
      email,
      subject, title,time, otp, name
    );
    transporter.sendMail(mail, (err) => {
      if (err) { 
        return reject(err);
      }
      return resolve({ success: true });
    });
  });
};
 
const invitationMailOptions = (sendTo, subject,  invitation) => {
  return {
    from: `${App_CONFIG.APP_NAME} ${domainMail.mail()}`,
    to: sendTo,
    subject,
    template: "event_invitation",
    context: { 
      email:invitation.email,
      appName: `${App_CONFIG.APP_NAME}`,
      event:invitation.title, 
      time:invitation.time,
      firstName :invitation.firstName,
      fee: invitation.fee,
      date: invitation.date,
      location: invitation.location,
      invite_link: `${config.FRONTEND_ORIGIN_URL/invitation.eventId}/?email=${invitation.email}`,
    },
  };
};
exports.invitationMailHandler = async (
  email, 
  subject, invitation
) => {
  return new Promise((resolve, reject) => {
    const mail = invitationMailOptions(
      email,
      subject, invitation
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
 