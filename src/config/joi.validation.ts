import * as Joi from 'joi'

export const JoiValidationSchema  = Joi.object({
    MONGO_DB: Joi.required(),
    PORT: Joi.number().default(3666),
    DEFAULT_LIMIT: Joi.number().default(1025),
})