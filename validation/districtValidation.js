const Joi = require("joi");

const districtValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  region_id: Joi.string().hex().length(24).required(),
});

const districtUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  region_id: Joi.string().hex().length(24).optional(),
});

module.exports = {
  districtValidationSchema,
  districtUpdateValidationSchema,
};
