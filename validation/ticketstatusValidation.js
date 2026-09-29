const Joi = require("joi");

const ticketstatusValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const ticketstatusUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
});

module.exports = {
  ticketstatusValidationSchema,
  ticketstatusUpdateValidationSchema,
};
