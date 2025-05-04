import { RegisterUserType } from "../schema/user.schema";
import { createUser, getUsers } from "../services/user.service";
import {Request, Response} from "express"
import User, { UserDocument } from "../models/user.model";
import { omit } from "lodash";
import TokenBlacklist from "../models/blacklist-token.model";

export const registerUserHandler = async (req: Request<{}, {}, RegisterUserType["body"]>, res: Response) : Promise<void>=> {
    try{ 
        const createdUser = await createUser(req.body)
        res.status(201).send(createdUser);
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(409).send(error.message);
        }else res.status(409).send("Something went wrong")
    }
}

export const getUsersHandler = async (req: Request, res: Response) => {
    try{
        const users = await getUsers()
        res.status(201).send(users);
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(409).send(error.message);
        }else res.status(409).send("Something went wrong")
    }
}
export const getUserProfileHandler = async (req: Request, res: Response) => {
    try{
        res.status(201).json((req as any).user);
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(409).send(error.message);
        }else res.status(409).send("Something went wrong")
    }
}

export const loginUserHandler = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.status(401).json({message : "Invalid email or password"});
        }

        const isMatch = await user?.comparePassword(password);
        if(!isMatch){
            res.status(401).json({message : "Invalid email or password"});
        }

        const token = user?.generateJWT();
        const withoutPassword = omit(user?.toJSON(), "password", "__v", "_id");
        res.cookie('token', token)
        res.status(200).json({token, ...withoutPassword});

    }catch(error: unknown){
        if(error instanceof Error){
            res.status(500).send(`Error while logging in the user : ${error.message}`);
        }else res.status(500).send("Something went wrong while logging in the user")
    }
}

export const logoutUserHandler = async (req: Request, res: Response) => {
    try{
        res.clearCookie('token')
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1] || req.headers["x-access-token"];
        if (!token) {
            res.status(400).json({ message: "No token found to logout" });
        }
        await TokenBlacklist.create({token});   
        res.status(200).json({message : "User logged out successfully"});
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(500).send(`Error while logging out the user : ${error.message}`);
        }else res.status(500).send("Something went wrong while logging out the user")
    }
}

