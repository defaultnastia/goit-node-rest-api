import Joi from "joi";
import { emailRegExp, subscriptionsList } from "../constants/user-constants.js";

export const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptionsList),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionsList)
    .required(),
});
