const { Types } = require('mongoose');
const { z } = require('zod');

exports.ZEventSchema = z.object({
    eventId: z.string({
        description: "Event ID",
        required_error: "Event ID is required",
        invalid_type_error: "Event ID is invalid"
    }).min(20, {message: "Event ID must be 20 characters"})
    .max(20, {message: "Event ID cannot exceed 20 characters"}),
    createdBy: z.instanceof(Types.ObjectId),
    title: z.string({
        description: "Event title",
        required_error: "Event tile is required",
        invalid_type_error: "Event title is invalid",
    }).min(3, {message: "Event title must be at least 3 characters"})
    .max(50, {message: "Event title cannot exceed 50 characters"}),
    flyer: z.array(
        z.object({
            id: z.string().url() ,
            url: z.string().url("Invalid URL"),
        })
    ).optional(),
    date: z.date({
        description: "Event date",
        required_error: "Event date is required",
        invalid_type_error: "Date format is invalid",
    }),
    time: z.string(),   
    invite: z.array(z.string().email("Invalid email")).optional(),
    rejection: z.array(z.string()).optional(),
    ticketPrice: z.number({
        description: "Event ticket price",
        required_error: "Event title price is required",
        invalid_type_error: "Event ticket price is invalid"
    }).nonnegative("tickPrice must be a non-negative number"),
    location: z.string({
        description: "Event Location",
        required_error: "Event location is required",
        invalid_type_error: "Event location is in a wrong format",
    }).min(3, {message: "Event location must be at least 3 characters"})
    .max(150)
    .trim(),
});
 