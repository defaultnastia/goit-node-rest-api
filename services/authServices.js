import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

// export const updateUser = (filter, data) => {
//   console.log(filter, data);
//   return User.findOneAndUpdate(filter, data);
// };

export const register = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (user) {
    throw HttpError(409, `Email in use: ${email}`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatar = gravatar.url(email, { protocol: "https" });

  return User.create({ ...data, password: hashPassword, avatarURL: avatar });
};

// --- error messages are extended for troubleshooting ---
export const login = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong: email");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong: password");
  }

  const payload = {
    id: user._id,
  };
  const token = createToken(payload);

  await updateUser({ _id: user._id }, { token });

  return { token, user };
};
