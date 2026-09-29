const Joi = require("joi");

const adminRegisterValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  login: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string().min(6).optional(),
  hashed_password: Joi.string().min(6).optional(),
  is_active: Joi.boolean().default(true),
  is_creator: Joi.boolean().default(false),
  hashed_refresh_token: Joi.string().allow("").optional(),
}).or("password", "hashed_password");

const adminLoginValidationSchema = Joi.object({
  login: Joi.string().trim().required(),
  password: Joi.string().required(),
});

const adminValidationSchema = adminRegisterValidationSchema;

const adminUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  login: Joi.string().trim().min(3).max(50).optional(),
  password: Joi.string().min(6).optional(),
  hashed_password: Joi.string().min(6).optional(),
  is_active: Joi.boolean().optional(),
  is_creator: Joi.boolean().optional(),
  hashed_refresh_token: Joi.string().allow("").optional(),
});

module.exports = {
  adminRegisterValidationSchema,
  adminLoginValidationSchema,
  adminValidationSchema,
  adminUpdateValidationSchema,
};
