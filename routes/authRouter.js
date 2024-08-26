import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middleware/authenticate.js";

import {
  userLoginSchema,
  userRegisterSchema,
} from "../schemas/usersSchemas.js";

const registerMiddleware = validateBody(userRegisterSchema);
const loginMiddleware = validateBody(userLoginSchema);

const authRouter = Router();

authRouter.post("/register", registerMiddleware, authControllers.register);

authRouter.post("/login", loginMiddleware, authControllers.login);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
