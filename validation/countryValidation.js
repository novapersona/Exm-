const Joi = require("joi");

const countryValidationSchema = Joi.object({
  country_name: Joi.string().trim().required(),
});

const countryUpdateValidationSchema = Joi.object({
  country_name: Joi.string().trim().optional(),
});

module.exports = {
  countryValidationSchema,
  countryUpdateValidationSchema,
};
