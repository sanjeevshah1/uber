import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { loginUserSchema, registerUserSchema } from "../schema/user.schema";
import { getUsersHandler, registerUserHandler, loginUserHandler } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", validateResource(registerUserSchema), registerUserHandler);
userRouter.get("",  getUsersHandler);
userRouter.post("/login",validateResource(loginUserSchema), loginUserHandler);

export default userRouter;