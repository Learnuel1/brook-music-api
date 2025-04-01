const { Schema, model, Types } = require('mongoose');;

const profileSchema = new Schema({
    account: {
        type: Types.ObjectId,
        required: true,
        ref: "Account",
    },
    userId: {
        type: String,
        required: [true, "User ID is required"],
        minlength: [15, "User ID must be 15 characters"],
        maxlength: [15, "User ID cannot exceed 15 characters"],
        validate: {
            validator: function (v) {
                return v.startsWith("BM");
            },
            message: "User ID must begin with BM",
        },
        trim: true,
    },
    stageName: {
        type: String, 
    },
    Nationality: {
        type: String, 
        minlength: [3, "Nationality must be at least 3 characters"],
        maxlength: [40, "Nationality cannot exceed 40 characters"],
    },
    picture: {
        type: [
            {
                id: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (v) {
                            return /^https?:\/\/.+\..+/.test(v);
                        },
                        message: "picture ID must be a valid URL",
                    },
                    trim: true,
                },
                url: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (v) {
                            return /^https?:\/\/.+\..+/.test(v);
                        },
                        message: "picture ID must be a valid URL",
                    },
                    trim: true,
                },
            },
        ],
        validate: {
            validator: function (v) {
                return v.length <= 1;
            },
            message: "only one profile picture is allowed",
        },
        default: [],
    },
});

const ProfileModel = model('Profile', profileSchema);

module.exports = ProfileModel;