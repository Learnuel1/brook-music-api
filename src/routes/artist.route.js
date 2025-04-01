const artistRouter = require("express").Router();
const shared = require("../shared");
artistRouter.get("/", shared.Controllers.profileController.getProfiles)

module.exports = { artistRouter}