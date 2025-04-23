import mongoose from "mongoose"
import logger from "./logger"
import config from "config"
const connect = async () => {
    const mongoUrl = config.get<string>("mongoUrl")
    try{
        await mongoose.connect(mongoUrl);
        logger.info(`Connected to database ${mongoUrl}`)
    }catch(error : unknown){
        if(error instanceof Error){
            logger.error(`Error connecting to database ${error.message}`)
        }else{
            logger.error(`Error connecting to database ${error}`)
        }
    }
}
export default connect;