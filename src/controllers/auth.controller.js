const { hashSync, compareSync, hash } = require("bcryptjs");
const { emailExist, defaultAccount, removeAccountByEmail, getAccountByToken, userExistById, updateAccount, createAccount, createTemporalInfo } = require("../service/interface");
const { isValidEmail, shortIdGen, generateStrongPassword, isStrongPassword, OTPGen } = require("../utils/Generator");
const { CONSTANTS, App_CONFIG } = require("../config");
const logger = require("../logger");
const { META, ERROR_FIELD } = require("../utils/actions");  
const config = require("../config/env");
const { sendEMailHandler, recoveryPasswordMailHandler } = require("../utils/mailer");
const { APIError } = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const { resBuilder } = require("../shared");

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


  exports.login = async (req, res, next) => {
	try {
		let token = req.cookies?.BroOk_m;
		if (!token) token = req.headers?.authorization?.split(' ')[1];
		if (!token) token = req.headers?.cookie?.split('=')[1];
        if(token) return next(APIError.unauthorized("You are already logged in"))
		const { email, password } = req.body;
		const exist = await emailExist(email.toLowerCase());
		if (!exist) return next(APIError.notFound('User does not exist', 404));
		if (exist.error) return next(APIError.customError(exist.error, 400));
		if (!compareSync(password, exist.password))
			return next(APIError.badRequest('Incorrect password'));
		const foundUser = await getAccountByToken(token);
		if (foundUser ) {
			jwt.verify(token, config.TOKEN_SECRETE, async (err, decoded) => {
				if (err) {
					const untrusted = await userExistById(decoded?.id);
          if(untrusted){
            untrusted.refreshToken = [];
            untrusted.save();

          }
				}
				if(decoded?.email === email) { 
					logger.info('Token reuse detected', { service: META.AUTH });
					return next(APIError.customError('You are already logged in', 403));
				}
			});
      return next(APIError.customError('You are already logged in', 403));
		}

		 
		let payload = {};
		payload = {
			id: exist._id,
			userId: exist.userId,
			type: exist.type, 
			firstName: exist.firstName,
			lastName: exist.lastName,
			email: exist.email,
		};

		const newToken = jwt.sign(payload, config.TOKEN_SECRETE, {
			expiresIn: "10m",
		});
		const newRefreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRETE, {
			expiresIn:   "20m",
		});
		 
		res.clearCookie('BroOk_m')
		let newRefreshTokenArray = [];
		if (token)
			newRefreshTokenArray = exist.refreshToken.filter(
				(rt) => rt !== token
			);
		else newRefreshTokenArray = exist.refreshToken;
		exist.refreshToken = [...newRefreshTokenArray, newRefreshToken]; 
		exist.save();
		const data =  resBuilder.removeAuth(exist.toObject());
		logger.info('Login successful', { service: META.AUTH });
		const response = resBuilder.reqResponse('login successful', data, 'user', {
			token:newToken,
			refreshToken: newRefreshToken,
		});
		res.cookie('BroOk_m', newToken, {
			httpOnly: false,
			secure: true,
			sameSite: 'none',
			// maxAge: 60 * 60 * 1000,
		});
		res.status(200).json(response);
	} catch (error) {
		next(error);
	}
};
exports.logout = async (req, res, next) => {
	try { 
		const {refreshToken} = req.body;
		if (!refreshToken)
			return next(APIError.unauthenticated('Refresh token is required'));
		const isUser = await getAccountByToken(refreshToken);
		if (!isUser) return next(APIError.unauthenticated());
		if (isUser?.error) return next(APIError.badRequest(isUser.error));
		jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRETE);
		const refreshTokenArr = isUser.refreshToken.filter((rt) => rt !== refreshToken);
			isUser.refreshToken = [...refreshTokenArr];
			isUser.save();
		
		logger.info('Logout successful', { service: META.AUTH });
		res.clearCookie('BroOk_m');
		res
			.status(200)
			.json({ success: true, msg: 'You have successfully logged out' });
	} catch (error) { 
		next(error);
	}
};


exports.handleRefreshToken = async (req, res, next) => {
	let token = req.cookies?.BroOk_m;
	if (!token) token = req.headers?.authorization?.split(' ')[1];
	if (!token) token = req.headers?.cookie?.split('=')[1];
	if (!token) return next(APIError.unauthenticated());
	const { refreshToken } = req.body;
	if (!refreshToken)
		return next(APIError.badRequest('RefreshToken is required'));
	const foundUser = await getAccountByToken(refreshToken);
	res.clearCookie('BroOk_m', {
		httpOnly: true,
		sameSite: 'None',
		secure: true,
	});
	// Detected refresh toke reuse
	if (!foundUser) {
		const check = jwt.decode(token, config.TOKEN_SECRETE);
		if (!check) return next(APIError.unauthenticated());
		const usedToken = await userExistById(check.id);
        if(usedToken){
            usedToken.refreshToken = [];
            usedToken.save();
        }
		logger.info('Token reuse detected', { service: META.AUTH });
		return next(APIError.customError(ERROR_FIELD.INVALID_TOKEN, 403));
	}
	const newRefreshTokenArr = foundUser.refreshToken.filter(
		(rt) => rt !== token
	);
	jwt.verify(
		refreshToken,
		config.REFRESH_TOKEN_SECRETE,
		async (err, decoded) => {
			if (err) {
				foundUser.refreshToken = [...newRefreshTokenArr];
				foundUser.save();
			}
			if (err || foundUser._id.toString() !== decoded.id)
				return next(APIError.customError(ERROR_FIELD.JWT_EXPIRED, 403));
			const payload = {
				id: foundUser._id,
				userId: foundUser.userId,
				type: foundUser.type, 
				firstName: foundUser.firstName,
				lastName: foundUser.lastName,
				email: foundUser.email, 
			};
			const token = jwt.sign(payload, config.TOKEN_SECRETE, {
				expiresIn: '10m',
			});
			const newRefreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRETE, {
				expiresIn: '20m',
			});
			foundUser.refreshToken = [...newRefreshTokenArr, token];
			foundUser.save();
			logger.info('Refresh Token generated successfully', {
				service: META.AUTH,
			});
			res.cookie('BroOk_m', token, {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res
				.status(200)
				.json({ success: true, token, refreshToken: newRefreshToken });
		}
	);
};

exports.resetLogin = async (req, res, next) => {
	try {
		 
		const check = await userExistById(req.user);
		if (!check) return res.status(404).json({ error: 'Incorrect password' });
		if (check.error) return res.status(404).json(check.error);
		const verify = compareSync(req.body.currentPassword, check.password);
		if (!verify)
			return next(APIError.customError('current password is incorrect', 400));
		const hashedPass = hashSync(req.body.newPassword, 12);
		if(compareSync(req.body.newPassword, check.password)) return next(APIError.badRequest("Choose an entirely new password"));
		const reset = await updateAccount(req.user, {password: hashedPass});
		if (!reset) return next(APIError.badRequest("Password reset failed, try again"));
		if (reset?.error) return next(APIError.badRequest(reset.error, 400)); 
		logger.info('Password reset successful', { meta: 'auth-service' }); 
		res.status(200).json({ success: true, msg: 'Password reset successful' });
	} catch (error) {
		next(error);
	}
};
exports.register = async (req, res, next ) => {
    try {
        const { password } = req.body;
        req.body.password = hashSync(password, 10);
        req.body.status = CONSTANTS.ACCOUNT_STATUS_OBJ.unverified;
        const save = await createAccount(req.body);
        if(!save) return next(APIError.badRequest("Registration failed, try again"));
        if(save?.error) return next(APIError.badRequest(save.error));
        logger.info("Registration completed successfully", {service: META.AUTH});
        res.status(200).json({success: true, message: "Registration completed successfully"});
    } catch (error ) {
        next (error);
    }
}

exports.sendRecoverMail = async (req, res, next) => {
	try {
	  const { email } = req.body;
	  if (!email) return next(APIError.badRequest('Email or Phone number is required'));
	  const userExist = await emailExist(email);
	  if (!userExist)
		return next(APIError.notFound(ERROR_FIELD.ACCOUNT_NOT_FOUND));
	  if (userExist?.error) return next(APIError.badRequest(userExist.error)); 
	  const OTP = OTPGen();
	  const expires = 2;
	   const payload = {email, id:userExist.userId};
	   const token = jwt.sign(payload, config.TOKEN_SECRETE,{expiresIn:`${expires}m`});
	  const info = {
		email,
		token,
		otp: hashSync(OTP, 10),
	  };
	  const save = await createTemporalInfo(info);
	  if (!save)
		return next(APIError.notFound(ERROR_FIELD.NOT_FOUND));
	  if (save?.error) return next(APIError.badRequest(save.error));
	  logger.info('Recovery info saved successfully', { service: META.ACCOUNT}); 
	  const result = await recoveryPasswordMailHandler(
		email,
		"Password Recovery" , "Password Recovery OTP" ,
		expires, OTP, userExist.firstName
	  );
	  if (result.error)
		return next(APIError.badRequest('Recovery mail failed to send'));
	  logger.info('Recovery mail sent successfully', { service: META.MAIL});
	  res.status(200).json({
		...result,
		msg: 'Recovery mail sent successfully',
	  });
	} catch (error) {
	  next(error);
	}
  };