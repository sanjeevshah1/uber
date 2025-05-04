import express from "express"
import router from "./router"
import config from "config"
import logger from "./utils/logger"
import connect from "./utils/connect"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const portNo = config.get<number>("portNo") || 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.listen(portNo, async ()=> {
    logger.info(`Server started at http://localhost:${portNo}`)
    await connect();
    router(app); 
})