import { Users } from "@/lib/UserModel";
import { TOCKEN_MAX_AGE, TWO_FACTOR_AUTHENTICATION } from "@/server_veriables/constants";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import qrcode from 'qrcode'

const jwt_secret = process.env.JWT_SECRET || "";


export const GET = async(req , { params }) => {
    try {
        const user = await Users.findOne(params);
        if(!user)  { 
            return NextResponse.json({ message:"Bad request!" })
        }
        else if(user.tfa?.qrcode) {
            return NextResponse.json({ message:"TFA activation request is received" , image:user.tfa?.qrcode });
        }
        const secret = user?.tfa?.secret;
        const uri = authenticator.keyuri(user.email , "2-factor-authentication" , secret);
        const image = await qrcode.toDataURL(uri);
        return NextResponse.json({ message:"TFA activation request is received" , image });
    } catch(error) {
        return NextResponse.json({ message:"Bad request!" } ,)
    }
}

export const POST = async(req , { params }) => {
    try {
        const { code } = await req.json();
        const user = await Users.findOne(params);
        if(!user)   return NextResponse.json({ message:"Bad request!" })
        const secret = user.tfa.secret;
        authenticator.options = { window: 1 };
        const isVerified = authenticator.check(code , secret);

        const opts = authenticator.generate(secret);
        // console.log(secret , code , opts , isVerified);
        if(!isVerified) {
            return NextResponse.json({ message:"wrong code, try again.." });            
        }
        user.tfa.active = true;
        await user.save();

        const tocken = sign({ _id:user._id , email:user.email , name:user.name , tfa:{ active:true } } , jwt_secret);

        cookies().set({
            name:TWO_FACTOR_AUTHENTICATION,
            value:tocken,
            // secure: process.env.NODE_ENV === 'production' && window.location.protocol === 'https:',
            httpOnly:true,
            maxAge:TOCKEN_MAX_AGE,
            sameSite:"strict",
            path:"/",
        })

        return NextResponse.json({ message:"2-factor-authentication is successfully activated on your profile" , user });
    } catch(error) {
        // console.error(error.message)
        return NextResponse.json({ message:"Bad request!" })
    }
}