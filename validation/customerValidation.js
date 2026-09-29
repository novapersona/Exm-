const Joi = require("joi");

const customerRegisterValidationSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).required(),
  last_name: Joi.string().trim().min(2).max(50).required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  password: Joi.string().min(6).optional(),
  hashed_password: Joi.string().min(6).optional(),
  email: Joi.string().email().required(),
  birth_date: Joi.date().required(),
  gender_id: Joi.string().hex().length(24).required(),
  lang_id: Joi.string().hex().length(24).required(),
  hashed_refresh_token: Joi.string().allow("").optional(),
}).or("password", "hashed_password");

const customerLoginValidationSchema = Joi.object({
  login: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().trim().optional(),
  password: Joi.string().required(),
}).or("login", "email", "phone");

const customerValidationSchema = customerRegisterValidationSchema;

const customerUpdateValidationSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).optional(),
  last_name: Joi.string().trim().min(2).max(50).optional(),
  phone: Joi.string().trim().min(7).max(20).optional(),
  password: Joi.string().min(6).optional(),
  hashed_password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  birth_date: Joi.date().optional(),
  gender_id: Joi.string().hex().length(24).optional(),
  lang_id: Joi.string().hex().length(24).optional(),
  hashed_refresh_token: Joi.string().allow("").optional(),
});

module.exports = {
  customerRegisterValidationSchema,
  customerLoginValidationSchema,
  customerValidationSchema,
  customerUpdateValidationSchema,
};
