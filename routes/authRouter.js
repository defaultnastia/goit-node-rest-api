import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";
import * as schemas from "../schemas/usersSchemas.js";

const registerMiddleware = validateBody(schemas.userRegisterSchema);
const loginMiddleware = validateBody(schemas.userLoginSchema);
const updateMiddleware = validateBody(schemas.userUpdateSchema);
const resendVerificationMiddleware = validateBody(schemas.userEmailSchema);

const authRouter = Router();

authRouter.post("/register", registerMiddleware, authControllers.register);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  resendVerificationMiddleware,
  authControllers.resendVerification
);

authRouter.post("/login", loginMiddleware, authControllers.login);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "",
  authenticate,
  updateMiddleware,
  authControllers.updateSubscription
);

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
