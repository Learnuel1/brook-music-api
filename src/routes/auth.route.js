const { validateRequestData } = require("../shared/middleware/data_validator.middleware");
const shared = require("../shared");
const authRouter = require("express").Router();
authRouter.post("/login", validateRequestData("ZLoginSchema"), shared.Controllers.authController.login)

module.exports = {
    authRouter,
}
