import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createToken } from "../helpers/jwt.js";

const findUser = (filter) => User.findOne(filter);
const { JWT_SECRET } = process.env;

export const signup = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (user) {
    throw HttpError(
      409,
      `User with email "${email}" has already been registered`
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const signin = async (data) => {
  const { email, password } = data;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Incorrect password");
  }

  const payload = {
    id: user._id,
  };

  const token = createToken(payload);

  return { token };
};
