import { Users } from "@/lib/UserModel"
import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
import { TOCKEN_MAX_AGE, TWO_FACTOR_AUTHENTICATION } from "@/server_veriables/constants"
const jwt_secret = process.env.JWT_SECRET || "";



export const PUT = async(req) => {
    try {
        const { email , password, code } = await req.json();
        // console.log(email , password , code);
        const user = (await Users.findOne({ email , password })).toObject();
        
        if(!user || !code || !user.tfa?.active) {
            return NextResponse.json({ message:"wrong credentials" , success:false});
        }
        
        const verify = authenticator.check(code , user.tfa.secret);
        if(!verify) {
            return NextResponse.json({ message:"wrong OTP! try again..", success:false });                
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