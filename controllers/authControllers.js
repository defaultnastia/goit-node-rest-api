import * as fs from "node:fs/promises";
import * as path from "node:path";
import Jimp from "jimp";
import * as authServices from "../services/authServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  await authServices.verifyEmail(verificationToken);

  res.json({
    message: "Email is verified",
  });
};

const resendVerification = async (req, res) => {
  const { email } = req.body;
  await authServices.resendVerificationEmail(email);

  res.json({
    message: "Verification email is resent",
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

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No picture found, please check the request data");
  }

  const { path: tempPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(tempPath, newPath);

  Jimp.read(newPath, (err, img) => {
    if (err) throw HttpError(500, err);
    img.resize(256, 256).write(newPath);
  });

  const { _id, avatarURL } = req.user;
  const avatar = path.join("avatars", filename);

  const oldAvatarPath = path.resolve("public", avatarURL);
  await fs.unlink(oldAvatarPath);

  const updatedData = await authServices.updateUser(
    { _id },
    { avatarURL: avatar }
  );

  res.json({
    message: "Avatar was updated",
    user: {
      email: updatedData.email,
      newAvatarExternalLink: `${process.env.HOST}:${process.env.PORT}/${updatedData.avatarURL}`,
    },
  });
};

export default {
  register: controllerWrapper(register),
  verify: controllerWrapper(verify),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
  resendVerification: controllerWrapper(resendVerification),
};
