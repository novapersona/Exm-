const Joi = require("joi");

const paymentmethodValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const paymentmethodUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  paymentmethodValidationSchema,
  paymentmethodUpdateValidationSchema,
};
