import controllerWrapper from "../decorators/controllerWrapper.js";
import * as authServices from "../services/authServices.js";

const register = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { token, user } = await authServices.login(req.body);
  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).send();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email: email, subscription: subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription: selectedPlan } = req.body;
  const updatedData = await authServices.updateUser(
    { _id },
    { subscription: selectedPlan }
  );

  res.json({
    message: "Subscription was updated",
    user: {
      email: updatedData.email,
      subscription: updatedData.subscription,
    },
  });
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
};
