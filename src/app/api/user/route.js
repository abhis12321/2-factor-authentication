import { NextResponse } from "next/server"
import { Users } from "@/lib/UserModel"
import { authenticator } from "otplib"
import QR from 'qrcode'
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { TOCKEN_MAX_AGE, TWO_FACTOR_AUTHENTICATION } from "@/server_veriables/constants"
import { sendOTP } from "@/server_veriables/sendOTP"
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
        const user = (await Users.findOne({ email , password })).toObject();
        if(!user) {
            return NextResponse.json({ message:"wrong credentials", success:false });
        } else if(user.tfa?.active) {
            return NextResponse.json({ message:"Multi factor authentication is required..", success:true, TFA:1 })
        } else {
            await sendOTP(email);
            return NextResponse.json({ message:"OTP sent to your email..", success:true, TFA:2 })
        }
    } catch(error) {
        // console.log(error.message)
        return NextResponse.json({ message:"wrong credentials", success:false });
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

