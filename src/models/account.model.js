const { Schema, model } = require("mongoose");
const { CONSTANTS } = require("../config");

const AccountSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 15,
        maxLength: 15,
        index: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    phoneNumber: {
        type: String,
        trim: true,
        index: true,
    },
    countryCode: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: CONSTANTS.ACCOUNT_TYPE,
        default: CONSTANTS.ACCOUNT_TYPE_OBJ.user,
    },
    refreshToken: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: CONSTANTS.ACCOUNT_STATUS,
        default: CONSTANTS.ACCOUNT_STATUS_OBJ.unverified,
    },
    
}, { timestamps: true, versionKey: false});
const AccountModel = model("Account", AccountSchema);
exports.AccountModel = AccountModel;