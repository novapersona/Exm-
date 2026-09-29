const Joi = require("joi");

const seattypeValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const seattypeUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  seattypeValidationSchema,
  seattypeUpdateValidationSchema,
};
