import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middleware/authenticate.js";

import {
  userLoginSchema,
  userRegisterSchema,
  userUpdateSchema,
} from "../schemas/usersSchemas.js";
import upload from "../middleware/upload.js";

const registerMiddleware = validateBody(userRegisterSchema);
const loginMiddleware = validateBody(userLoginSchema);
const updateMiddleware = validateBody(userUpdateSchema);

const authRouter = Router();

authRouter.post("/register", registerMiddleware, authControllers.register);

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
