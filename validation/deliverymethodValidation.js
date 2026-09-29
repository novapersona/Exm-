const Joi = require("joi");

const deliverymethodValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const deliverymethodUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  deliverymethodValidationSchema,
  deliverymethodUpdateValidationSchema,
};
