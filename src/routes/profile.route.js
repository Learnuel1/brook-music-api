const shared = require("../shared");
const { multerImage } = require("../utils/multer");

const profileRouter = require("express").Router();

profileRouter.put("/", multerImage.single("profileImage"), shared.Controllers.profileController.updateProfile ).get("/", shared.Controllers.profileController.getProfile)

module.exports = { profileRouter}