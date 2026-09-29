const Joi = require("joi");

const humancategoryValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  start_age: Joi.number().required(),
  finish_age: Joi.number().required(),
  gender_id: Joi.string().hex().length(24).required(),
});

const humancategoryUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  start_age: Joi.number().optional(),
  finish_age: Joi.number().optional(),
  gender_id: Joi.string().hex().length(24).optional(),
});

module.exports = {
  humancategoryValidationSchema,
  humancategoryUpdateValidationSchema,
};
