import mongoose from "mongoose"
import User, { UserDocument, UserDocumentWithoutPassword } from "../models/user.model"
import { omit } from "lodash"
import { RegisterUserType } from "../schema/user.schema"
export const createUser = async (userData: RegisterUserType["body"]) => {
    const {email, name, password} = userData;
    try{
        const user = await User.create({email, name, password});
        const withoutPassword = omit(user.toJSON(), "password");
        const token = user.generateJWT();
        return {token,...withoutPassword};
    }catch(error: unknown){
        if(error instanceof Error){
            throw new Error(error.message);
        }
        else{
            throw new Error("Something went wrong");
        }
    }
}

export const getUsers = async () => {
    try{
        const users = await User.find({}).lean().exec();
        return users.map((user) => omit(user, "password"));
    }catch(error: unknown){
        if(error instanceof Error){
            throw new Error(error.message);
        }
        else{
            throw new Error("Something went wrong");
        }
    }
}
