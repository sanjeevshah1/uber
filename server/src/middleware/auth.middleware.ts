import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import config from "config"
import User from "../models/user.model"; 
import TokenBlacklist from "../models/blacklist-token.model";
export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1] || req.headers["x-access-token"]
    if(!token){
        res.status(401).json({message:  `Token not found`});
    }
    const isBlackListed = await TokenBlacklist.findOne({token});
    if(isBlackListed){
        res.status(401).json({message: "Unauthorized"});
    }
    try{
        const publicKey = config.get<string>("publicKey")!;
        const decoded = jwt.verify(token, publicKey);
        const {_id} = decoded as {_id: string};
        const user = await User.findById(_id);
        if(!user){
            res.status(401).json({message: "Unauthorized"});
        }else{
            (req as any).user = user;
            next();
        }
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(401).json({message: error.message});
        }else res.status(401).json({message: "Something went wrong"})
    }
}