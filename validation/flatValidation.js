const Joi = require("joi");

const flatValidationSchema = Joi.object({
  floor: Joi.number().optional(),
  etaj: Joi.number().optional(),
  condition: Joi.string().trim().required(),
}).or("floor", "etaj");

const flatUpdateValidationSchema = Joi.object({
  floor: Joi.number().optional(),
  etaj: Joi.number().optional(),
  condition: Joi.string().trim().optional(),
});

module.exports = {
  flatValidationSchema,
  flatUpdateValidationSchema,
};
