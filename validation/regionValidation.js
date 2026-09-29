const Joi = require("joi");

const regionValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const regionUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  regionValidationSchema,
  regionUpdateValidationSchema,
};
