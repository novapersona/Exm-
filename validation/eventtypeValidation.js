const Joi = require("joi");

const eventtypeValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  parent_event_type_id: Joi.string().hex().length(24).allow(null, ""),
});

const eventtypeUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().optional(),
  parent_event_type_id: Joi.string().hex().length(24).allow(null, ""),
});

module.exports = {
  eventtypeValidationSchema,
  eventtypeUpdateValidationSchema,
};
