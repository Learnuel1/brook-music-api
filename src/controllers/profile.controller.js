const logger = require("../logger");
const { getExistingPicture, updateAccountProfile, viewProfile, viewArtistProfiles } = require("../service/interface");
const { META } = require("../utils/actions");
const { APIError } = require("../utils/apiError");
const { deleteFileFromCloudinary, uploadSingleFileToCloudinary } = require("../utils/cloudinary");

exports.updateProfile = async (req, res, next) => {
    try {

        // check if there is file
        if (req.file) {
            const pictureExist = await getExistingPicture(req.userId);
            if (pictureExist && pictureExist?.picture?.length > 0) {
                await deleteFileFromCloudinary(pictureExist.id);
                logger.info("Deleted existing image successfully", { service: META.CLOUDINARY });
            }
            const upload = await uploadSingleFileToCloudinary(req.file, req);
            if (upload?.error) return next(APIError.badRequest(upload.message));
            logger.info("Profile Image uploaded successfully", { service: META.CLOUDINARY });
            req.body.picture = {
                id: upload.secure_url,
                url: upload.public_id
            }
        }
        const info = {
        };
        for (let key in req.body) {
            info[key] = req.body[key];
        }
        const update = await updateAccountProfile(req.user, info);
        if (!update) return next(APIError.badRequest("Profile update failed, try again"));
        if (update?.error) return next(APIError.badRequest(update.error));
        logger.info("Profile Image saved successfully", { service: META.ACCOUNT });
        res.status(200).json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        next(error);
    }
}
exports.getProfile = async (req, res, next) => {
    try {
        const info = await viewProfile(req.user);
        if (!info) return next(APIError.badRequest("Profile view failed, try again"));
        if (info?.error) return next(APIError.badRequest(info.error));
        logger.info("Profile retrieved successfully", { service: META.ACCOUNT });
        res.status(200).json({ success: true, profile: info });
    } catch (error) {
        next(error)
    }
}
exports.getProfiles = async (req, res, next) => {
    try {
        const { userId } = req.query;
        const info = await viewArtistProfiles(userId);
        if (!info) return next(APIError.badRequest("Profile view failed, try again"));
        if (info?.error) return next(APIError.badRequest(info.error));
        logger.info("Profile retrieved successfully", { service: META.ACCOUNT });
        res.status(200).json({ success: true, artists: info });
    } catch (error) {
        next(error)
    }
}