const ProfileModel = require("../models/profile.model");

exports.update = async (account, info) => {
    try{
        return await  ProfileModel.findOneAndUpdate({account},{... info, $Set:{picture: info.picture}});

    } catch (error) {
        return { error : error.message };
    }
}
exports.existingProfile = async (userId) => {
    try {
        return await ProfileModel.findOne({userId});
    } catch (error) {
        return {error : error.message };
    }
}
exports.view = async (account) => {
    try {
        return await ProfileModel.findOne({account}).select("-_id -userId -account -createdAt -picture._id -picture.id -__v");
    } catch (error) {
        return {error: error.message}
    }
}