import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { v4 as uuid } from "uuid";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import { createToken } from "../helpers/jwt.js";
import * as templates from "../helpers/emailTemplates.js";

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const register = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (user) {
    throw HttpError(409, `Email in use: ${email}`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatar = gravatar.url(email, { protocol: "https" });

  const verificationToken = uuid();

  const createdUser = User.create({
    ...data,
    password: hashPassword,
    avatarURL: avatar,
    verificationToken,
  });

  const message = templates.getVerificationEmail(email, verificationToken);
  sendEmail(message);

  return createdUser;
};

export const verifyEmail = async (verificationToken) => {
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User or code not found");
  }

  await updateUser(
    { _id: user._id },
    { isVerified: true, verificationToken: null }
  );
};

export const resendVerificationEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, "User with such email doesn't exist");
  }

  if (user.isVerified) {
    throw HttpError(400, "Email is already verified");
  }

  const message = templates.getResendVerificationEmail(
    email,
    user.verificationToken
  );
  sendEmail(message);
};

// --- error messages are extended for troubleshooting ---
export const login = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong: email doesn't exist");
  }

  if (!user.isVerified) {
    throw HttpError(401, "Email or password is wrong: email is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong: password is incorrect");
  }

  const payload = {
    id: user._id,
  };
  const token = createToken(payload);

  await updateUser({ _id: user._id }, { token });

  return { token, user };
};
