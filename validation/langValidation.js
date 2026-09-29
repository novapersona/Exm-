const Joi = require("joi");

const langValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const langUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  langValidationSchema,
  langUpdateValidationSchema,
};
