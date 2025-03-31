const config = require("../../config/env");

require("dotenv").config();

exports. mailAuth = {
  service: `gmail`,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
};
  
exports.domainMail = {
  mail: () => config.MAIL_USER,
};
