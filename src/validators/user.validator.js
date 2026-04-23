import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6),
}).min(1);
