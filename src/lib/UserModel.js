import mongoose from "mongoose"
import { dbConnect } from "./dbConnect";

dbConnect();
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})


export const Users = mongoose.models.User || mongoose.model("User" , userSchema);