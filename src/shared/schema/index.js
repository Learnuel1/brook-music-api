const { ZAccountSchema, ZLoginSchema } = require("./account.schema")
const { ZEventSchema } = require("./event.schema")
const { ZProfileSchema } = require("./profile.schema")
const { ZResetLoginSchema } = require("./resetpassword.schema")
module.exports = {
    ZAccountSchema,
    ZLoginSchema, 
    ZResetLoginSchema,
    ZProfileSchema,
    ZEventSchema,
}