const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  cart_id: Joi.string().hex().length(24).required(),
  finished: Joi.date().allow(null).optional(),
  fineshed: Joi.date().allow(null).optional(),
  payment_method_id: Joi.string().hex().length(24).required(),
  delivery_method_id: Joi.string().hex().length(24).required(),
  discount_id: Joi.string().hex().length(24).allow(null, "").optional(),
  status_id: Joi.string().hex().length(24).required(),
  total_price: Joi.number().min(0).optional(),
});

const bookingUpdateValidationSchema = Joi.object({
  cart_id: Joi.string().hex().length(24).optional(),
  finished: Joi.date().allow(null).optional(),
  fineshed: Joi.date().allow(null).optional(),
  payment_method_id: Joi.string().hex().length(24).optional(),
  delivery_method_id: Joi.string().hex().length(24).optional(),
  discount_id: Joi.string().hex().length(24).allow(null, "").optional(),
  status_id: Joi.string().hex().length(24).optional(),
  total_price: Joi.number().min(0).optional(),
});

module.exports = {
  bookingValidationSchema,
  bookingUpdateValidationSchema,
};
