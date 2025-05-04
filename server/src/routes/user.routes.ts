import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { loginUserSchema, registerUserSchema } from "../schema/user.schema";
import { getUsersHandler, registerUserHandler, loginUserHandler, getUserProfileHandler, logoutUserHandler } from "../controllers/user.controller";
import { authUser } from "../middleware/auth.middleware";
const userRouter = Router();

userRouter.post("/register", validateResource(registerUserSchema), registerUserHandler);
userRouter.get("",  getUsersHandler);
userRouter.get("/profile",authUser ,getUserProfileHandler);
userRouter.post("/login",validateResource(loginUserSchema), loginUserHandler);
userRouter.get("/logout", logoutUserHandler);

export default userRouter;