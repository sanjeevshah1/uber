import { create } from "ts-node";
import { RegisterUserType } from "../schema/user.schema";
import { createUser, getUsers } from "../services/user.service";
import {Request, Response} from "express"
import { UserDocument } from "../models/user.model";
import { UserDocumentWithoutPassword } from "../models/user.model";
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