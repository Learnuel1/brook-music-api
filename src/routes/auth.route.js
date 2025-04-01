const { validateRequestData } = require("../shared/middleware/data_validator.middleware");
const shared = require("../shared");
const { userRequired, tokenRequired } = require("../middlewares/auth.middleware");
const authRouter = require("express").Router();
authRouter.post("/login", validateRequestData("ZLoginSchema"), shared.Controllers.authController.login).post("/logout", shared.Controllers.authController.logout).post("/refreshtoken", shared.Controllers.authController.handleRefreshToken).patch("/update-password", userRequired, validateRequestData("ZResetLoginSchema"), shared.Controllers.authController.updateLogin).post("/recovery", shared.Controllers.authController.sendRecoverMail).post("/verify-otp", shared.Controllers.authController.verifyOTP).post("/reset-password", tokenRequired, shared.Controllers.authController.resetLogin).post("/register", validateRequestData("ZAccountSchema"), shared.Controllers.authController.registerAccount)

module.exports = {
    authRouter,
}
