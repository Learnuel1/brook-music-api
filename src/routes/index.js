const Router = require("express").Router();
const { CONSTANTS } = require("../config");
const { userRequired } = require("../middlewares/auth.middleware");
const { notAllowedAccount } = require("../shared/middleware/data_validator.middleware");
const { artistRouter } = require("./artist.route");
const { authRouter } = require("./auth.route");
const { eventRouter } = require("./event.route");
const { profileRouter } = require("./profile.route");

Router.use("/auth", authRouter);
Router.use("/profile", userRequired, notAllowedAccount(CONSTANTS.ACCOUNT_TYPE_OBJ.admin), profileRouter);
Router.use("/artist", artistRouter);
Router.use("/event", eventRouter)

module.exports = Router;