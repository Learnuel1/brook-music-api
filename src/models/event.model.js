const { Schema, Types, model } =  require('mongoose');;

const EventSchema = new Schema({
    eventId: {
        type: String,
        required: [true, "Event ID is required"],
        minlength: [20, "Event ID must be 20 characters"],
        maxlength: [20, "Event ID cannot exceed 20 characters"],
    },
    createdBy: {
        type: Types.ObjectId,
        required: true,
        ref: "Account",
    },
    title: {
        type: String,
        required: [true, "Event title is required"],
        minlength: [3, "Event title must be at least 3 characters"],
        maxlength: [50, "Event title cannot exceed 50 characters"],
    },
    flyer: {
        type: [
            {
                id: {
                    type: String, 
                },
                url: {
                    type: String,
                },
            },
        ],
        default: [ ],
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String, 
    },
    invite: {
        type: [String],
        default: [],
    },
    rejection: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    ticketPrice: {
        type: Number,
        required: [true, "Event ticket price is required"],
        min: [0, "Ticket price must be a non-negative number"],
    },
}, {timestamps: true, versionKey: false});

const EventModel = model("Event", EventSchema);
module.exports = EventModel;