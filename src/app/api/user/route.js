import { NextResponse } from "next/server"
import { Users } from "@/lib/UserModel"
import { authenticator } from "otplib"
import QR from 'qrcode'


export const POST = async(req) => {
    try {
        const data = await req.json();
        const secret = String(authenticator.generateSecret());
        const uri = authenticator.keyuri(data.email , "2-factor-authentication" , secret);
        const qrcode = await QR.toDataURL(uri);
        const tfa = { secret , qrcode };
        const user = new Users({ ...data, tfa });
        console.log(secret , typeof(secret))
        await user.save();
        setInterval(() => {
            console.log(authenticator.generate(secret))
        }, 5000);
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
        user.tfa.secret = "bujho to jaane";
        return NextResponse.json({ message:user ? "user logged-in successfully!" : "wrong credentials" , user });
    } catch(error) {
        return NextResponse.json({ message:error.message });
    }
} 


