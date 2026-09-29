const Joi = require("joi");

const customercardValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  number: Joi.string().trim().min(12).max(19).required(),
  year: Joi.string().trim().length(2).required(),
  month: Joi.string().trim().length(2).required(),
  is_active: Joi.boolean().default(true),
  is_main: Joi.boolean().default(false),
});

const customercardUpdateValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).optional(),
  name: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  number: Joi.string().trim().min(12).max(19).optional(),
  year: Joi.string().trim().length(2).optional(),
  month: Joi.string().trim().length(2).optional(),
  is_active: Joi.boolean().optional(),
  is_main: Joi.boolean().optional(),
});

module.exports = {
  customercardValidationSchema,
  customercardUpdateValidationSchema,
};
