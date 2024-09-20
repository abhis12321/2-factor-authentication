import { Users } from "@/lib/UserModel";
import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import qrcode from 'qrcode'


export const GET = async(req , { params }) => {
    try {
        const user = await Users.findOne(params);
        if(!user)   return NextResponse.json({ message:"Bad request!" })
        const secret = user?.tfa?.secret;
        const uri = authenticator.keyuri(user.email , "2-factor-authentication" , secret);
        const image = await qrcode.toDataURL(uri);
        user.tfa.secret = secret;
        user.tfa.qrcode = image;
        await user.save();
        return NextResponse.json({ message:"TFA activation request is received" , image:user?.tfa?.qrcode });
    } catch(error) {
        return NextResponse.json({ message:"Bad request!" })
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
        console.log(secret , code , opts , isVerified);
        if(!isVerified) {
            return NextResponse.json({ message:"wrong code, try again.." });            
        }
        user.tfa.active = true;
        await user.save();
        return NextResponse.json({ message:"2-factor-authentication is successfully activated on your profile" , user });
    } catch(error) {
        return NextResponse.json({ message:"Bad request!" })
    }
}