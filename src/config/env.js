/* eslint-disable no-undef */
require("dotenv").config();
const config = {
  DB_URI: process.env.DB_URL, 
  SERVER_PORT: process.env.PORT,
  FRONTEND_ORIGIN_URL: process.env.FRONTEND_ORIGIN_URL,
  TOKEN_SECRETE: process.env.TOKEN_SECRETE,
  REFRESH_TOKEN_SECRETE: process.env.REFRESH_TOKEN_SECRETE,
  NODE_ENV: process.env.NODE_ENV,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  ADMIN_MAIL: process.env.ADMIN_MAIL,
  ADMIN_NUMBER: process.env.ADMIN_NUMBER,   
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  UPLOAD_PRESET: process.env.UPLOAD_PRESET,
  UPLOAD_FOLDER: process.env.UPLOAD_FOLDER,
};
module.exports = config;
