const Router = require("express").Router();
const { authRouter } = require("./auth.route");

Router.use("/auth", authRouter);

module.exports = Router;