import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import * as authServices from "../services/authServices.js";

const signup = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signin = async (req, res) => {
  const { token } = await authServices.signin(req.body);
  res.json({ token });
};

export default {
  signup: controllerWrapper(signup),
  signin: controllerWrapper(signin),
};
