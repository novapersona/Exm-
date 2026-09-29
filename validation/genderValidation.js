const Joi = require("joi");

const genderValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const genderUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  genderValidationSchema,
  genderUpdateValidationSchema,
};
