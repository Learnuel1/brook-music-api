const { z } = require("zod");

exports.ZResetLoginSchema = z.object({
    currentPassword: z.string({
        description: "Current password",
        required_error: "Current password is required",
        invalid_type_error: "Current password  is invalid",
    }) 
    .min(8,  { message: "Current password must be at least 8 characters"}),
    newPassword: z.string({
        description: "New  password",
        required_error: "New Password is required",
    })
    .min(8, { message: "New password must be at least 8 characters"})
})