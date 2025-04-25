import mongoose from "mongoose"
import bcrypt from "bcrypt"
import config from "config"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        firstname : {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"]
        },
        lastname : {
            type: String,
            minlength: [3, "First name must be at least 3 characters long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 3 characters long"]
    },
    password: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
    }
})


userSchema.methods.generateJWT = function() : string{
    const user = this as UserDocument;
    const privateKey = config.get<string>("privateKey");
    console.log("THe private key is", privateKey);
    const token = jwt.sign({_id : user._id}, privateKey,  { algorithm: "RS256", expiresIn: "1h" })
    return token;
}
userSchema.methods.comparePassword = async function(candidatePassword: string) : Promise<boolean>{
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((error)=> false );
}
userSchema.pre("save", async function(next){
    const user = this;
    if(!user.isModified("password")) return next();
    const saltFactor = config.get<number>("saltFactor");
    const salt = await bcrypt.genSalt(saltFactor);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
})


export interface UserDocument extends mongoose.Document{
    name: {
        firstname: string;
        lastname: string | null;
    };
    email: string;
    password: string;
    generateJWT() :string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    socketId?: string;
}
export type UserDocumentWithoutPassword = Omit<UserDocument, "password">
const User = mongoose.model<UserDocument>("User",userSchema)
export default User