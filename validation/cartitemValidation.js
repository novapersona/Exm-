const Joi = require("joi");

const cartitemValidationSchema = Joi.object({
  ticket_id: Joi.string().hex().length(24).required(),
  cart_id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().min(1).default(1).optional(),
});

const cartitemUpdateValidationSchema = Joi.object({
  ticket_id: Joi.string().hex().length(24).optional(),
  cart_id: Joi.string().hex().length(24).optional(),
  quantity: Joi.number().min(1).optional(),
});

module.exports = {
  cartitemValidationSchema,
  cartitemUpdateValidationSchema,
};
