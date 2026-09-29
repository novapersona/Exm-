const Joi = require("joi");

const discountValidationSchema = Joi.object({
  discount: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  discount_value: Joi.number().optional(),
  discount_type: Joi.string().valid("percentage", "fixed").default("percentage"),
  code: Joi.string().trim().allow("").optional(),
  finish_date: Joi.date().required(),
});

const discountUpdateValidationSchema = Joi.object({
  discount: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  discount_value: Joi.number().optional(),
  discount_type: Joi.string().valid("percentage", "fixed").optional(),
  code: Joi.string().trim().allow("").optional(),
  finish_date: Joi.date().optional(),
});

module.exports = {
  discountValidationSchema,
  discountUpdateValidationSchema,
};
