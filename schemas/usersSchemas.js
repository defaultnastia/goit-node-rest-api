import Joi from "joi";
import { emailRegExp, subscriptionsList } from "../constants/user-constants.js";

export const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptionsList),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});
