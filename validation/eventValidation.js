const Joi = require("joi");

const eventValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  photo: Joi.string().trim().required(),
  start_date: Joi.date().required(),
  start_time: Joi.string().trim().required(),
  finish_date: Joi.date().required(),
  finish_time: Joi.string().trim().required(),
  info: Joi.string().allow(""),
  event_type_id: Joi.string().hex().length(24).required(),
  human_category_id: Joi.string().hex().length(24).required(),
  venue_id: Joi.string().hex().length(24).required(),
  lang_id: Joi.string().hex().length(24).required(),
  release_date: Joi.date().required(),
});

const eventUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  photo: Joi.string().trim().optional(),
  start_date: Joi.date().optional(),
  start_time: Joi.string().trim().optional(),
  finish_date: Joi.date().optional(),
  finish_time: Joi.string().trim().optional(),
  info: Joi.string().allow(""),
  event_type_id: Joi.string().hex().length(24).optional(),
  human_category_id: Joi.string().hex().length(24).optional(),
  venue_id: Joi.string().hex().length(24).optional(),
  lang_id: Joi.string().hex().length(24).optional(),
  release_date: Joi.date().optional(),
});

module.exports = {
  eventValidationSchema,
  eventUpdateValidationSchema,
};
