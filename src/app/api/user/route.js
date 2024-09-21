import { NextResponse } from "next/server"
import { Users } from "@/lib/UserModel"
import { authenticator } from "otplib"
import QR from 'qrcode'
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { TOCKEN_MAX_AGE, TWO_FACTOR_AUTHENTICATION } from "@/server_veriables/constants"
const jwt_secret = process.env.JWT_SECRET || "";

export const GET = async() => {
    try {
        const tocken = cookies().get(TWO_FACTOR_AUTHENTICATION)?.value;
        const user = verify(tocken , jwt_secret);
        // console.log(tocken , user);
        return NextResponse.json({ message:`Logged-in..` , user });
    } catch(error) {
        console.log(error.message);
        return NextResponse.json({ message:`Bad request: ${error.message}` });
    }
}

export const POST = async(req) => {
    try {
        const data = await req.json();
        const secret = String(authenticator.generateSecret());
        const uri = authenticator.keyuri(data.email , "2-factor-authentication" , secret);
        const qrcode = await QR.toDataURL(uri);
        const tfa = { secret , qrcode };
        const user = new Users({ ...data, tfa });
        await user.save();
        // console.log(secret , typeof(secret))
        return NextResponse.json({ message:"user registration is completed!" });
    } catch(error) {
        return NextResponse.json({ message:`Bad request: ${error.message}` });
    }
} 



export const PUT = async(req) => {   //login
    try {
        const { email , password, code } = await req.json();
        // console.log(email , password , code);
        const user = (await Users.findOne({ email , password })).toObject();
        if(!user) {
            return NextResponse.json({ message:"wrong credentials" });
        } else if(user.tfa?.active) {
            const verify = authenticator.check(code , user.tfa.secret);
            if(!verify) {
                return NextResponse.json({ message:"wrong OTP! try again..", TFA:!code && true });                
            }
        }
        user.tfa.secret = "bujho to jaane";
        const tocken = sign({ _id:user._id , email , name:user.name , tfa:{ active:user.tfa.active } } , jwt_secret);

        cookies().set({
            name:TWO_FACTOR_AUTHENTICATION,
            value:tocken,
            // secure: process.env.NODE_ENV === 'production' && window.location.protocol === 'https:',
            httpOnly:true,
            maxAge:TOCKEN_MAX_AGE,
            sameSite:"strict",
            path:"/",
        })

        return NextResponse.json({ message:"user logged-in successfully!" , user});
    } catch(error) {
        return NextResponse.json({ message:`wrong credentials, Bad request: Try again..` });
    }
} 


export const DELETE = () => {
    try {
        cookies().delete(TWO_FACTOR_AUTHENTICATION);        
        return NextResponse.json({ success:true, message:"user logged-out.." });
    } catch(error) {
        return NextResponse.json({ message:error.message } , {status:404});        
    }
}