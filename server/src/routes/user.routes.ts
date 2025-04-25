import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { registerUserSchema } from "../schema/user.schema";
import { getUsersHandler, registerUserHandler } from "../controllers/user.controller";
const userRouter = Router();
userRouter.post("/register", validateResource(registerUserSchema), registerUserHandler);
userRouter.get("",  getUsersHandler);

export default userRouter;