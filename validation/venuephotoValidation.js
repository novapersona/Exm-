const Joi = require("joi");

const venuephotoValidationSchema = Joi.object({
  venueId: Joi.string().hex().length(24).optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  url: Joi.string().trim().required(),
}).or("venueId", "venue_id");

const venuephotoUpdateValidationSchema = Joi.object({
  venueId: Joi.string().hex().length(24).optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  url: Joi.string().trim().optional(),
});

module.exports = {
  venuephotoValidationSchema,
  venuephotoUpdateValidationSchema,
};
