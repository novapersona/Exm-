const Joi = require("joi");

const typesValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const typesUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  typesValidationSchema,
  typesUpdateValidationSchema,
};
