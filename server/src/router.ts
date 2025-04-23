import express from "express";
import { Express } from "express";
const router = (app: Express) => {
    app.get("/", (req, res) => {
        res.send("hello world")
    })
}
export default router;