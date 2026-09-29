const Joi = require("joi");

const venueValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  site: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  schema: Joi.string().allow(""),
  region_id: Joi.string().hex().length(24).required(),
  district_id: Joi.string().hex().length(24).required(),
});

const venueUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  site: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  schema: Joi.string().allow(""),
  region_id: Joi.string().hex().length(24).optional(),
  district_id: Joi.string().hex().length(24).optional(),
});

module.exports = {
  venueValidationSchema,
  venueUpdateValidationSchema,
};
