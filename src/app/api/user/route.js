import { Users } from "@/lib/UserModel";
import { NextResponse } from "next/server"


export const POST = async(req) => {
    try {
        const data = await req.json();
        const user = new Users(data);
        await user.save();
        // console.log(user);
        return NextResponse.json({ message:"user registration is completed!" });
    } catch(error) {
        return NextResponse.json({ message:error.message });
    }
} 



export const PUT = async(req) => {
    try {
        const { email , password, code } = await req.json();
        console.log(email , password , code);
        const user = await Users.findOne({ email , password });
        // if(user.tfa?.active) {
        //     if(!code) {
        //         return NextResponse.json({ message:"wrong credentials" });                
        //     } else {

        //     }
        // }
        return NextResponse.json({ message:user ? "user logged-in successfully!" : "wrong credentials" , user });
    } catch(error) {
        return NextResponse.json({ message:error.message });
    }
} 


