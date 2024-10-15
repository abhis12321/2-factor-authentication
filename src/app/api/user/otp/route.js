import { Users } from "@/lib/UserModel"
import { NextResponse } from "next/server"
import speakeasy from "speakeasy"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
import { TOCKEN_MAX_AGE, TWO_FACTOR_AUTHENTICATION } from "@/server_veriables/constants"
const jwt_secret = process.env.JWT_SECRET || "";


export const GET = async() => {
    try {
        const email = "jack@gmail.com"
        const secret = speakeasy.generateSecret({ length: 30 })
        const otp = speakeasy.totp({
            secret:`${email}`,
            encoding:"base32",
            step:300, // OTP is valid for 5 minutes(300 secs)
            digits:6,
            algorithm:"sha1",
        })

        return NextResponse.json({ otp , secret:secret.base32 });
    } catch(error) {
        console.log(error.message)
        return NextResponse.json({  }, { status:500 })
    }
}


export const PUT = async(req) => {
    try {
        const { email , password , otp } = await req.json();
        const user = (await Users.findOne({ email , password })).toObject();
        if(!user || !otp || user.tfa?.active) {
            return NextResponse.json({ message:"wrong credentials" , success:false });
        }
        const verified = speakeasy.totp.verify({
            secret: email,
            encoding: 'base32',
            token: otp,
            step: 300, // Must match the step used during generation
            window: 1, // Allow 1 step before and after
            digits: 6,
            algorithm: 'sha1',
          });
      
        if(!verified) {
            return NextResponse.json({ message:"wrong OTP! try again.." , success:false });
        }
        
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

        delete user.password;
        return NextResponse.json({ message:"user logged-in successfully!" , user , success:true });
    } catch(error) {
        return NextResponse.json({ message:"wrong credentials", success:false });
    }
}