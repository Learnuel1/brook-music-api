const {  Types } = require('mongoose');
const { z } = require('zod');
 
exports.ZProfileSchema = z.object({
    account: z.instanceof(Types.ObjectId),  
    userId: z.string({
        description: "User ID",
        required_error: "User ID is required",
        invalid_type_error: "User ID is invalid"
    }).min(15, {message: "User ID must be 15 characters"})
    .max(15, {message: "User ID cannot exceed 15 characters"})
    .startsWith("BM", {message : "User ID must begin with BM"})
    .trim(),
    stageName: z.string({
        description: "Stage Name",
        required_error: "Stage name is required",
        invalid_type_error: "Stage name is invalid",
    }),
    Nationality: z.string({
        description: "Nationality",
        required_error: "Nationality is required"
    }).min(3, {message: "Nationality must be at least 3 characters"}).max(40, {message: "Nationality cannot exceed 40 characters"}).optional(),
    picture: z.array(z.object({
        id: z.string().url({message: "picture ID must be a valid URL"}).trim(),
        url: z.string().url({message: "picture ID must be a valid URL"}).trim()
    })).max(1, {message: "only one profile picture is allowed"}).optional(),
});