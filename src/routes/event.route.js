const { adminRequired } = require("../middlewares/auth.middleware");
const shared = require("../shared");
const { validateRequestData } = require("../shared/middleware/data_validator.middleware");
const { multerImage } = require("../utils/multer");
const eventRouter = require("express").Router();

eventRouter.post("/new", adminRequired, multerImage.single("flyer"), validateRequestData("ZEventSchema"), shared.Controllers.eventController.createNewEvent).get("/", shared.Controllers.eventController.getEvents).delete("/:eventId", adminRequired, shared.Controllers.eventController.deleteEvent).post("/invite", adminRequired, shared.Controllers.eventController.inviteArtist)
module.exports = {
    eventRouter,
}