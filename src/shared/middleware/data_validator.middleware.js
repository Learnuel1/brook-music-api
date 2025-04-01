const Schemas = require("../schema")
const { hashSync } = require("bcryptjs");
const { default: mongoose, Types, ObjectId } = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const { isStrongPassword, isPhoneNumberValid, shortIdGen, isValidEmail } = require("../../utils/Generator");
const { APIError } = require("../../utils/apiError");
module.exports = {
  validateRequestData(schema, data = {}) { 
    return  async (req, res, next) => {
      try{ 
        if(!schema) return next(APIError.badRequest("Schema name is required"));
        if ( schema === "ZAccountSchema") {
          req.body.userId = `BM${shortIdGen(13)}`;
          if(isValidEmail(req.body.email) === false) return next(APIError.badRequest("Email is invalid"));
          if(isStrongPassword(req.body.password) === false) return next(APIError.badRequest("Password is weak"));
        }
        if ( schema === "ZResetLoginSchema") {
          if(isStrongPassword(req.body.newPassword) === false) return next(APIError.badRequest("New Password is weak"));
        } 
    Schemas[`${schema}`].parse(req.body); 
     next();
   }catch(error){
     next(error);  
   }
 }
 },
 
  accountType(type="", role="") { 
   return  async (req, _res, next) => {
   try{
   if(!req.body?.type) req.body.type = type;
   if(!req.body?.role)  req.body.role = role;
    const {password, userId, phoneNumber} = req.body;
    if (isStrongPassword(req.body.password) === false) return next(APIError.badRequest("Password is weak"));
    if(password) req.body.password = hashSync(password, 12)
    if(phoneNumber) {
      if(!isPhoneNumberValid( phoneNumber)) next(APIError.badRequest("Invalid Phone number"))
      if(phoneNumber.charAt(0) === "+"){
        req.body.phoneNumber =  "0".concat(phoneNumber.slice(4)) ;
        req.body.countryCode = phoneNumber.slice(0,4)
      } else   req.body.phoneNumber =phoneNumber 
    }
    if(!userId) { 
      req.body.userId = `BM${shortIdGen()}`;
     }
     
     next();
   }catch(error){
     next(error);  
   }
 }
 },
  allowedRoles(roles) { 
   return  async (req, res, next) => {
   
   try{ 
   if(!roles.includes(req.userRole.toLowerCase())) return next(APIError.unauthorized("You don't have required permission"))
     next();
   }catch(error){
     next(error);  
   }
 }
 },
  notAllowedRoles(roles) { 
   return  async (req, res, next) => {
   try{
   if(roles.includes(req.userRole.toLowerCase())) return next(APIError.unauthorized("You don't have required permission"))
     next();
   }catch(error){
     next(error);  
   }
 }
},
  notAllowedAccount(type){ 
   return  async (req, res, next) => {
   try{
   if(type.toLowerCase() === req.userType.toLowerCase()) return next(APIError.unauthorized("You don't have required permission"))
     next();
   }catch(error){
     next(error);  
   }
 }
 },
 renameZodSchema(schema) { 
  return  async (req, res, next) => {
  try{
    let rename = schema.slice(0,(schema.length-6)).slice(1);
    if(!schema) return next(APIError.badRequest("Zod Schema name is required"));
   req.schema = rename;
    next();
  }catch(error){
    next(error);  
  }
}
},
}



