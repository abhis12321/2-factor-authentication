import { Users } from "@/lib/UserModel";
import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import qrcode from 'qrcode'


export const GET = async(req , { params }) => {
    try {
        const secret = authenticator.generateSecret();
        const uri = authenticator.keyuri(params._id , "2-factor-authentication" , secret);
        const image = await qrcode.toDataURL(uri);
        const user = await Users.findOne(params);
        if(!user)   return NextResponse.json({ message:"Bad request!" })
        user.tfa.secret = secret;
        await user.save();
        return NextResponse.json({ message:"TFA activation request is received" , image });
    } catch(error) {
        return NextResponse.json({ message:"Bad request!" })
    }
}