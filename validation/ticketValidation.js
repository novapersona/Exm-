const Joi = require("joi");

const ticketValidationSchema = Joi.object({
  event_id: Joi.string().hex().length(24).required(),
  seat_id: Joi.string().hex().length(24).required(),
  price: Joi.number().required(),
  service_fee: Joi.number().required(),
  status_id: Joi.string().hex().length(24).required(),
  ticket_type_id: Joi.string().hex().length(24).required(),
});

const ticketUpdateValidationSchema = Joi.object({
  event_id: Joi.string().hex().length(24).optional(),
  seat_id: Joi.string().hex().length(24).optional(),
  price: Joi.number().optional(),
  service_fee: Joi.number().optional(),
  status_id: Joi.string().hex().length(24).optional(),
  ticket_type_id: Joi.string().hex().length(24).optional(),
});

module.exports = {
  ticketValidationSchema,
  ticketUpdateValidationSchema,
};
