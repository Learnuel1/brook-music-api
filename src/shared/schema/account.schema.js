const { z } = require("zod")
const { CONSTANTS } = require("../../config")

exports.ZAccountSchema = z.object({
    userId: z.string({
        description: "Account user ID",
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string",
    }).min(15, {message: "User ID must be at least 15 characters long"})
    .max(15, {message: "User ID must be at most 15 characters long"})
    .trim(),
    firstName: z.string({
        description: "Account first name",
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
    }).min(2, {message: "First name must be at least 2 characters long"})
    .max(30, {message: "First name must be at most 30 characters long"})
    .trim(),
    lastName: z.string({
        description: "Account last name",
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    }).min(2, {message: "Last name must be at least 2 characters long"})
    .max(30, {message: "Last name must be at most 30 characters long"})
    .trim(),
    email: z.string({
        description: "Account email",
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({message: "Email must be a valid email address"})
    .trim(),
    password: z.string({
        description: "Account password",
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(8, {message: "Password must be at least 8 characters long"}),
    phoneNumber: z.string({
        description: "Account phone number",
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    }).optional(),
    countryCode: z.string({
        description: "Account country code",
        required_error: "Country code is required",
        invalid_type_error: "Country code must be a string",
    }).optional(),
    type: z.enum(CONSTANTS.ACCOUNT_TYPE, {
        description: "Account type",
        required_error: "Type is required",
        invalid_type_error: "Type must be a string",
    }).default(CONSTANTS.ACCOUNT_TYPE_OBJ.user),
    refreshToken: z.array(z.string()).optional(),
    status: z.enum(CONSTANTS.ACCOUNT_STATUS, {
        description: "Account status",
        required_error: "Status is required",
        invalid_type_error: "Status must be a string",
    }).default(CONSTANTS.ACCOUNT_STATUS_OBJ.unverified),
});

exports.ZLoginSchema = z.object({
    email: z.string({
        description: "Email on account",
        required_error: "Email is required",
        invalid_type_error: "Email is invalid",
    })
    .email()
    .trim(),
    password: z.string({
        description: "Account password",
        required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters"})
})

exports.ZResetLoginSchema = z.object({
    currentPassword: z.string({
        description: "Current password",
        required_error: "Current password is required",
        invalid_type_error: "Current password  is invalid",
    }) 
    .min(8,  { message: "Purrent password must be at least 8 characters"}),
    newPassword: z.string({
        description: "New  password",
        required_error: "New Password is required",
    })
    .min(8, { message: "New password must be at least 8 characters"})
})