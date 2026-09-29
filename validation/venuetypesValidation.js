const Joi = require("joi");

const venuetypesValidationSchema = Joi.object({
  venueId: Joi.string().hex().length(24).optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  typeId: Joi.string().hex().length(24).optional(),
  type_id: Joi.string().hex().length(24).optional(),
}).or("venueId", "venue_id").or("typeId", "type_id");

const venuetypesUpdateValidationSchema = Joi.object({
  venueId: Joi.string().hex().length(24).optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  typeId: Joi.string().hex().length(24).optional(),
  type_id: Joi.string().hex().length(24).optional(),
});

module.exports = {
  venuetypesValidationSchema,
  venuetypesUpdateValidationSchema,
};
