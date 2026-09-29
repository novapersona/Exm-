const Joi = require("joi");

const cartValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).required(),
  finishedAt: Joi.date().allow(null).optional(),
  fineshedAt: Joi.date().allow(null).optional(),
  status_id: Joi.string().hex().length(24).required(),
  expiresAt: Joi.date().optional(),
});

const cartUpdateValidationSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).optional(),
  finishedAt: Joi.date().allow(null).optional(),
  fineshedAt: Joi.date().allow(null).optional(),
  status_id: Joi.string().hex().length(24).optional(),
  expiresAt: Joi.date().optional(),
});

module.exports = {
  cartValidationSchema,
  cartUpdateValidationSchema,
};
