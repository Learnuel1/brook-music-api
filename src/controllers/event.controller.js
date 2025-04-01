const logger = require("../logger");
const { createEvent, getEvents, removeEvent, getEventById, emailExist, sendInvite } = require("../service/interface");
const { META } = require("../utils/actions");
const { APIError } = require("../utils/apiError");
const { uploadSingleFileToCloudinary } = require("../utils/cloudinary");
const { invitationMailHandler } = require("../utils/mailer");

exports.createNewEvent = async (req, res, next) => {
    try {
        if (req.file) {
            const upload = await uploadSingleFileToCloudinary(req.file, req);
            if (upload?.error) return next(APIError.badRequest(upload.message));
            logger.info("Event Image uploaded successfully", { service: META.CLOUDINARY });
            req.body.flyer = {
                id: upload.secure_url,
                url: upload.public_id
            }
        }
        const info = {};
        for (let key in req.body) {
            info[key] = req.body[key];
        } 
        const create = await createEvent(info);
        if (!create) return next(APIError.badRequest("Event failed to create, try again"));
        if (create?.error) return next(APIError.badRequest(create.error));
        logger.info("Event flyer Image saved successfully", { service: META.ACCOUNT });
        res.status(200).json({ success: true, message: "Event created successfully" });
    } catch (error) {
        next(error);
    }
}
exports.getEvents = async (req, res, next ) => {
    try {
            const { search } = req.query;
        let query = {};
        if(search) {
            query = {
                $or: [
                    { eventId: search  },
                    { title: { $regex: new RegExp(search, 'i') } },
                    { date:  search  },
                    { time:  search  },
                    { ticketPrice: { $regex: new RegExp(search, 'i') } },
                ]
            }
        }
        const events = await getEvents(query, req.userType);
        if(!events) return next(APIError.badRequest("something went wrong, try again"));
        if(events?.error) return next(APIError.badRequest(events.error));
        logger.info("Events retrieved successfully", {service: META.EVENT})
      
       res.status(200).json({message: "found", events});
    } catch (error) {
        next(error);
    }
}

exports.deleteEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        if (!eventId) return next(APIError.badRequest("Event ID is required"));

        const deleted = await removeEvent(eventId);
        if (!deleted) return next(APIError.badRequest("Event not found or failed to delete"));
        if (deleted?.error) return next(APIError.badRequest(deleted.error));

        logger.info("Event deleted successfully", { service: META.EVENT });
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        next(error);
    }
};
exports.inviteArtist = async (req, res, next ) => {
    try{
        const { eventId, artist} = req.body;
        if (!eventId || !artist) return next(APIError.badRequest("Event ID and artist details are required"));
        const event = await getEventById(eventId);
        if(!event) return next(APIError.notFound("Event does not exist")); 
        const artistInfo = await emailExist(artist);
        if(!artistInfo) return next(APIError.notFound("Event does not exist")); 
        const invitation = {
            eventId,
            email: artist,
            firstName: artistInfo.firstName,
            location: event.location,
            fee: event.ticketPrice,
            date: event.date.toLocaleDateString(),
            event: event.title,
            time: event.time,
        };
        const invite = await sendInvite(eventId, artist);
        if(!invite) return next(APIError.badRequest("Invitation failed, try again")); 
        if(invite?.error) return next(APIError.badRequest(invite.error)); 
        // send mail
        const result = await invitationMailHandler(
            artist, "Invitation",   invitation
                );
         if (result.error)
             return next(APIError.badRequest('Recovery mail failed to send'));
        logger.info('Invitation mail sent successfully', { service: META.MAIL });
        logger.info("Artist invited successfully", { service: META.EVENT });
        res.status(200).json({ success: true, message: "Artist invited successfully" });
    } catch (error ){
        next (error)
    }
}