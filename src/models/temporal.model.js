const { model } = require("mongoose");
const { Schema } = require("mongoose");

const TemporalSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        index: true
    },
    token: {
        type: [String],
        default: [],
    },
    otp: {
        type: String,
        index: true,
    }
},
 {timestamps: true} 
);
const TemporalModel = model("Temporal", TemporalSchema);
module.exports = TemporalModel;
