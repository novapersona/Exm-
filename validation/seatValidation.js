const Joi = require("joi");

const seatValidationSchema = Joi.object({
  sector_id: Joi.string().hex().length(24).required(),
  row_number: Joi.number().required(),
  number: Joi.number().required(),
  venue_id: Joi.string().hex().length(24).required(),
  seat_type_id: Joi.string().hex().length(24).required(),
  location_in_schema: Joi.string().allow(""),
});

const seatUpdateValidationSchema = Joi.object({
  sector_id: Joi.string().hex().length(24).optional(),
  row_number: Joi.number().optional(),
  number: Joi.number().optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  seat_type_id: Joi.string().hex().length(24).optional(),
  location_in_schema: Joi.string().allow(""),
});

module.exports = {
  seatValidationSchema,
  seatUpdateValidationSchema,
};
