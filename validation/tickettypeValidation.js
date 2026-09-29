const Joi = require("joi");

const tickettypeValidationSchema = Joi.object({
  ticket_type: Joi.string().trim().required(),
});

const tickettypeUpdateValidationSchema = Joi.object({
  ticket_type: Joi.string().trim().optional(),
});

module.exports = {
  tickettypeValidationSchema,
  tickettypeUpdateValidationSchema,
};
