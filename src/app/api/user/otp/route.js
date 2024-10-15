import { NextResponse } from "next/server"
import speakeasy from "speakeasy"


export const GET = async() => {
    try {
        const email = "jack@gmail.com"
        const secret = speakeasy.generateSecret({ length: 30 })
        const otp = speakeasy.totp({
            secret:`${secret.base32}${email}`,
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