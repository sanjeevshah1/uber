import { Express } from "express";
import userRouter from "./routes/user.routes";
const router = (app: Express) => {
    app.get("/", (req, res) => {
        res.send("hello world")
    })
    app.use("/user", userRouter);
}
export default router;