const { validateRequestData } = require("../shared/middleware/data_validator.middleware");
const shared = require("../shared");
const { userRequired } = require("../middlewares/auth.middleware");
const authRouter = require("express").Router();
authRouter.post("/login", validateRequestData("ZLoginSchema"), shared.Controllers.authController.login).post("/logout", shared.Controllers.authController.logout).post("/refreshtoken", shared.Controllers.authController.handleRefreshToken).patch("/update-password", userRequired, validateRequestData("ZResetLoginSchema"), shared.Controllers.authController.resetLogin).post("/recovery", shared.Controllers.authController.sendRecoverMail)

module.exports = {
    authRouter,
}
