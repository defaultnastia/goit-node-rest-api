import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../decorators/validateBody.js";
import { userSignInSchema, userSignUpSchema } from "../schemas/usersSchemas.js";

const signUpMiddleware = validateBody(userSignUpSchema);
const signInMiddleware = validateBody(userSignInSchema);

const authRouter = Router();

authRouter.post("/signup", signUpMiddleware, authControllers.signup);

authRouter.post("/signin", signInMiddleware, authControllers.signin);

export default authRouter;
