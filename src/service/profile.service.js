const { CONSTANTS } = require("../config");
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
exports.viewArtist = async (userId) => {
    try {
        if(userId) {
        return await ProfileModel.findOne({userId, type:CONSTANTS.ACCOUNT_TYPE_OBJ.artist}).populate([{
        path: "account",
        model: "Account",
        select: "userId firstName lastName phoneNumber email status -_id"
    }]).select("-_id -userId -account -createdAt -picture._id -picture.id -__v");
}   else{
    return await ProfileModel.find({type:CONSTANTS.ACCOUNT_TYPE_OBJ.artist}).populate([{
        path: "account",
        model: "Account",
        select: "userId firstName lastName phoneNumber email status -_id"
    }]).select("-_id -userId -account -createdAt -picture._id -picture.id -__v");
}
    } catch (error) {
        return {error: error.message}
    }
}