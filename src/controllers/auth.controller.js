const { hashSync } = require("bcryptjs");
const { emailExist, defaultAccount, removeAccountByEmail } = require("../service/interface");
const { isValidEmail, shortIdGen, generateStrongPassword } = require("../utils/Generator");
const { CONSTANTS, App_CONFIG } = require("../config");
const logger = require("../logger");
const { META, ERROR_FIELD } = require("../utils/actions");  
const config = require("../config/env");
const { sendEMailHandler } = require("../utils/mailer");

exports.defaultAdminAccount = async () => {
    try {   
        if(!isValidEmail(config.ADMIN_MAIL)) throw new Error("Invalid email");
        const exist = await emailExist(config.ADMIN_MAIL)
        if(exist) return logger.info(`${exist.type} already exist`, {
          service: META.ACCOUNT,
        });  
        const password =  generateStrongPassword(12);
        const info = {
          password: hashSync(password, 10),
          email:config.ADMIN_MAIL,
          firstName: App_CONFIG.APP_NAME,
          lastName: App_CONFIG.APP_NAME,
          phoneNumber: config.ADMIN_NUMBER,
          type: CONSTANTS.ACCOUNT_TYPE_OBJ.admin, 
          userId: `BM${shortIdGen(13)}`,
          status: CONSTANTS.ACCOUNT_STATUS_OBJ.verified,
        } 
        let account = await defaultAccount(info);
        if(!account) return logger.info("Admin Account creation failed", {
          service: META.ACCOUNT,
        })
        if(account.error) return logger.info(account.error, {
          service: META.ACCOUNT,
        });
        logger.info('Admin Account created successfully', {
          service: META.ACCOUNT,
        });   
        const emailTemp = ` 
<!DOCTYPE html>
<html>
<head>
	<title> Admin Login Credentials</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f2f2f2;
		}
		.container {
			width: 80%;
			margin: 40px auto;
			background-color: #fff;
			padding: 20px;
			border: 1px solid #ddd;
			box-shadow: 0 0 10px rgba(0,0,0,0.1);
		}
		.header {
			background-color: #333;
			color: #fff;
			padding: 10px;
			border-bottom: 1px solid #ddd;
		}
		.content {
			padding: 20px;
		}
		.button {
			background-color: #333;
			color: #fff;
			padding: 10px 20px;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
		.button:hover {
			background-color: #444;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h2> Admin Login Credentials</h2>
		</div>
		<div class="content">
			<p>Dear ${info.firstName },</p>
			<p>We are excited to welcome you to ${App_CONFIG.APP_NAME}!</p>
			<p>Your login credentials are as follows:</p>
			<ul>
				<li><strong>Username:</strong> ${info.email}</li>
				<li><strong>Password:</strong> ${password}</li>
			</ul>
			<p>To access your account, please visit <a href="[Login URL]">[Login URL]</a> and enter your username and password.</p>
			<p>If you have any issues logging in, please don't hesitate to contact us at <a href="mailto:${info.email}">${info.email}</a>.</p>
			<p>Best regards,</p>
			<p>${App_CONFIG.APP_NAME}</p>
		</div>
	</div>
</body>
</html>
        `
         // email admin login info
         const result = await sendEMailHandler(info.email, "Account creation", emailTemp);
         if (result.error) {
           await removeAccountByEmail(info.email);
           return logger.info(ERROR_FIELD.REG_FAILED, {
            service: META.ACCOUNT,
          });
         }
         logger.info('Admin login mail sent successfully', {
          service: META.ACCOUNT,
        });  
      } catch (error) {
        throw new Error(error);
      }
  };