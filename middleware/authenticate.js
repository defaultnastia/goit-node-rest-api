import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

// --- error messages are extended for troubleshooting ---

const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Not authorized: no auth header"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized: not bearer"));
  }

  const { data, error } = verifyToken(token);
  if (error) {
    return next(HttpError(401, `Not authorized: invalid token ${token}`));
  }

  const { id } = data;
  const user = await findUser({ _id: id });
  if (!user) {
    return next(HttpError(401, "Not authorized: no user"));
  }

  if (!user.token) {
    return next(HttpError(401, "Not authorized: token was cleared"));
  }

  req.user = user;

  next();
};

export default authenticate;
