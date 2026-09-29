const Joi = require("joi");

const sectorValidationSchema = Joi.object({
  sector_name: Joi.string().trim().required(),
  venue_id: Joi.string().hex().length(24).allow(null, "").optional(),
});

const sectorUpdateValidationSchema = Joi.object({
  sector_name: Joi.string().trim().optional(),
  venue_id: Joi.string().hex().length(24).allow(null, "").optional(),
});

module.exports = {
  sectorValidationSchema,
  sectorUpdateValidationSchema,
};
