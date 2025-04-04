const { default: mongoose } = require("mongoose");
const { CONSTANTS } = require("../config");
const { AccountModel } = require("../models/account.model");
const TemporalModel = require("../models/temporal.model");
const ProfileModel = require("../models/profile.model");

exports.create = async (details) => {
    try{
        const info = await AccountModel.create({...details});
        if(info) {
            await ProfileModel.create({account:info._id, userId: details.userId});
        }
        return info;
    } catch (error) {
        return {error: error.message };
    }
}
exports.emailExists = async (email) => {
    try{
        return await AccountModel.findOne({email}).select("-__v");
    } catch ( error ) {
        return {error: error.message };
    }
}
exports.accountExistByToken = async ( refreshToken ) => {
    try{
        return await AccountModel.findOne({refreshToken})
    } catch ( error ) {
        return {error: error.message };
    }
}
exports.accountExistById = async ( id ) => {
    try {
        return await AccountModel.findById(id)
    } catch ( error ) {
        return {error: error.message };
    }
}
exports.findTemporalAccount = async (query) => {
    try{
        return await TemporalModel.findOne(query);
    } catch (error) {
        return {error: error.message };
    }
}
exports.update = async (id, info) => {
    try {
        return await AccountModel.findByIdAndUpdate({_id:id}, {...info}, {returnOriginal: false});
    } catch (error ){
        return {error: error.message };
    }
}
exports.delete = async (id) => {
    try {
        return await AccountModel.findByIdAndDelete(id);
    } catch (error) {
        return {error: error.message}
    }
}
exports.deleteByEmail = async (email) => {
    try {
        return await AccountModel.findOneAndDelete({email});
    } catch (error) {
        return {error: error.message}
    }
}
exports.defaultRegistration = async (details) => {
    try {
      const check = await AccountModel.findOne({role:CONSTANTS.ACCOUNT_TYPE_OBJ.admin});
      if (check)
        return {error: `${CONSTANTS.ACCOUNT_TYPE_OBJ.admin} account already exist`};
      return await AccountModel.create({...details});
    } catch (error) {
      if (error instanceof mongoose.Error.CastError && error.kind === 'ObjectId') {
        return  {error:'Invalid account ID format'} ;
     }
      return {error};
    }
  };
  exports.removeTemp = async (query) => {
    try {
        return await TemporalModel.findOneAndDelete(query)
    } catch ( error ) {
        return {error: error.message}
    }
  } 
  exports.createTempAccount = async (info) => {
    try{
        await TemporalModel.findOneAndDelete({email: info.email});
        return await TemporalModel.create({...info});
    } catch (error) {
        return {error: error.message};
    }
  }