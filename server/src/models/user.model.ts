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
        select: false
    },
    socketId: {
        type: String,
    }
})

userSchema.pre("save", async function(next){
    const user = this as UserDocument;
    if(!user.isModified("password")) return next();
    const saltFactor = config.get<number>("saltFactor");
    const salt = await bcrypt.genSalt(saltFactor);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
})

userSchema.methods.generateJWT = function(){
    const user = this as UserDocument;
    const privateKey = config.get<string>("privateKey");
    const token = jwt.sign({_id : user._id}, privateKey)
    return token;
}
userSchema.methods.comparePassword = async function(candidatePassword: string) : Promise<boolean>{
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((error)=> false );
}

userSchema.statics.hashPassword = async function(password: string) : Promise<string>{
    return await bcrypt.hash(password, 10)
}

export interface UserDocument extends mongoose.Document{
    name: {
        firstname: string;
        lastname: string | null;
    };
    email: string;
    password: string;
    socketId: string;
}
const User = mongoose.model("User",userSchema)
export default User