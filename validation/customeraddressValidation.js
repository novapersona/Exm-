const Joi = require("joi");

const customeraddressValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().required(),
  region_id: Joi.string().hex().length(24).required(),
  district_id: Joi.string().hex().length(24).required(),
  street: Joi.string().trim().required(),
  house: Joi.string().trim().required(),
  flat_id: Joi.string().hex().length(24).required(),
  location: Joi.string().trim().required(),
  post_index: Joi.string().trim().required(),
  info: Joi.string().allow(""),
});

const customeraddressUpdateValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).optional(),
  name: Joi.string().trim().optional(),
  region_id: Joi.string().hex().length(24).optional(),
  district_id: Joi.string().hex().length(24).optional(),
  street: Joi.string().trim().optional(),
  house: Joi.string().trim().optional(),
  flat_id: Joi.string().hex().length(24).optional(),
  location: Joi.string().trim().optional(),
  post_index: Joi.string().trim().optional(),
  info: Joi.string().allow(""),
});

module.exports = {
  customeraddressValidationSchema,
  customeraddressUpdateValidationSchema,
};
