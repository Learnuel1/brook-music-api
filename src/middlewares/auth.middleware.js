const { APIError } = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const { ERROR_FIELD } = require("../utils/actions");
const config = require("../config/env"); 
const { CONSTANTS } = require("../config"); 
const { Types } = require("mongoose");

const adminRequired = async (req, res, next) => {
  try {
    let token = req.cookies?.grub_ex;
    if (!token) token = req.headers?.authorization?.split(" ")[1];
    if (!token) token = req.headers?.cookie?.split("=")[1];
    if (!token) return next(APIError.unauthenticated());
    const payload = jwt.verify(token, config.TOKEN_SECRETE);
    if (payload?.type?.toLowerCase() !== CONSTANTS.ACCOUNT_TYPE_OBJ.admin && payload?.type.toLowerCase() !== CONSTANTS.ACCOUNT_TYPE_OBJ.dev)
      return next(APIError.unauthorized());
    req.user = new Types.ObjectId(payload.id)
    req.userId = payload.userId;
    req.userRole = payload.role; 
    req.userType = payload.type;
    const userInfo = {}// = await userExistById(new Types.ObjectId(payload.id));
   if(!userInfo || userInfo === null) return next(APIError.unauthenticated());
    req.body.createdBy = {
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      id: payload.id,
      role: payload.role,
      type: payload.type,
    }
    req.user = userInfo._id;
    next();
  } catch (error) {
    if (error.message === ERROR_FIELD.JWT_EXPIRED) next(APIError.unauthenticated());
    next(error);
  }
};
const othersRequired = async (req, res, next) => {
  try {
    let token = req.cookies?.grub_ex;
    if (!token) token = req.headers?.authorization?.split(" ")[1];
    if (!token) token = req.headers?.cookie?.split("=")[1];
    if (!token) return next(APIError.unauthenticated());
    const payload = jwt.verify(token, config.TOKEN_SECRETE);
    if (CONSTANTS.ACCOUNT_TYPE.includes(payload.role?.toLowerCase()) && payload.role.toLowerCase() === CONSTANTS.ACCOUNT_TYPE_OBJ.shopper)
      return next(APIError.unauthorized());
    req.userId = payload.userId;
    req.userRole = payload.role; 
    req.userType = payload.type; 
    next();
  } catch (error) {
    if (error.message === ERROR_FIELD.JWT_EXPIRED) next(APIError.unauthenticated());
    next(error);
  }
};
const userRequired = async (req, res, next) => {
  try {
    let token = req.cookies?.grub_ex;
    if (!token) token = req.headers?.authorization?.split(" ")[1];
    if (!token) token = req.headers?.cookie?.split("=")[1];
    if (!token) return next(APIError.unauthenticated());
    const payload = jwt.verify(token, config.TOKEN_SECRETE);
    const isUser = await userExistById(new Types.ObjectId(payload.id));
    if (!isUser) return next(APIError.customError(`user does not exist`, 404));
    if (isUser?.error) return next(APIError.customError(isUser?.error), 400);
    req.user = new Types.ObjectId(payload.id)
    req.userId = payload.userId;
    req.userRole = payload.role;
    req.userType = payload.type;
    req.firstName = isUser.firstName;
    req.email = isUser.email;
    req.token = token
    if(new RegExp(payload.role, 'i').test(CONSTANTS.ACCOUNT_TYPE_OBJ.rider))   req.onBoarded = payload.onBoarded;
    next();
  } catch (error) {
    if (error.message === ERROR_FIELD.JWT_EXPIRED) 
      next(APIError.unauthenticated());
    else next(error);
  }
};  
const verifyOTPToken = async (req, res, next) => {
  try {
    let token = req.cookies?.grub_ex;
    if (!token) token = req.headers?.authorization?.split(" ")[1];
    if (!token) token = req.headers?.cookie?.split("=")[1];
    if (!token) return next(APIError.unauthenticated());
    const payload = jwt.verify(token, config.TOKEN_SECRETE);
    const isUser = await getUserById(new Types.ObjectId(payload.id));
    if (!isUser) return next(APIError.customError(`OTP not exist`, 404));
    if (isUser.error) return next(APIError.customError(isUser.error), 400);
    req.userId = payload.id;
    req.userRole = payload.role;
    req.firstName = isUser.firstName;
    req.email = isUser.email;
    next();
  } catch (error) {
    if (error.message === ERROR_FIELD.JWT_EXPIRED) 
      next(APIError.badRequest("OTP expired"));
    else next(error);
  }
}; 
  
const tokenRequired = async (req, res, next) => {
  try {
    let token = req.cookies?.grub_ex;
    if (!token || token === "null") token = req.headers?.authorization?.split(" ")[1];
    if (!token || token === "null") token = req.headers?.cookie?.split("=")[1];
    if (!token || token === "null") return next(APIError.unauthenticated("Token is required"));
    let findExisting;
    if(req.path !== "/reset_password"){
      findExisting = await temporalAccExistByToken(token.trim());
      if (!findExisting) return next(APIError.unauthenticated("Token does not exist"));
     }
    jwt.verify(token, config.TOKEN_SECRETE, (err) => {
      if (err) return next(APIError.unauthenticated("Token expired"));
    });
    const payload = jwt.decode(token, config.TOKEN_SECRETE);
    req.email = payload.email;
    req.token = token;
    req.userType = payload.type;
    next();
  } catch (error) {
    next(error);
  }
};  
  
module.exports = {
  adminRequired,
  userRequired,  
  verifyOTPToken,
  driverRequired,
  tokenRequired,
  othersRequired, 
};
