const { CONSTANTS } = require("../config")
const EventModel = require("../models/event.model")

exports.create = async (details) => {
    try{
        return await EventModel.create({...details, $set: {flyer: details.flyer}})
    } catch (error) {
        return {error: error.message}
    }
}
exports.update = async (eventId, details) => {
    try {
        return await EventModel.findOneAndUpdate({eventId}, {...details, $set:{flyer: details?.flyer}})
    } catch (error) {
        return {error: error.message}
    }
}
exports.events = async (query, userType = "user") => {
    try {
        return await EventModel.find({query}).select(` ${userType !== CONSTANTS.ACCOUNT_TYPE_OBJ.admin? "-__v -_id -createdBy -createdAt -updatedAt -flyer._id -flyer.id" : "-__v -_id -flyer._id -flyer.id"}`)
    } catch (error) {
        return {error: error.message}
    }
}
exports.eventExistById = async (eventId) => {
    try {
        return await EventModel.findOne({eventId}).select("-__v -_id")
    } catch (error) {
        return {error: error.message}
    }
}
exports.delete = async (eventId) => {
    try{
        return await EventModel.findOneAndDelete({eventId});
    } catch (error) {
        return {error: error.message}
    }
 }
exports.inviteArtist = async (eventId, invite) => {
    try{
        return await EventModel.findOneAndUpdate({eventId}, { $addToSet:{invitation: invite} });
    } catch (error) {
        return {error: error.message}
    }
 }