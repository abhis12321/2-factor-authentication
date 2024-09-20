import { NextResponse } from "next/server"


export const POST = async(req) => {
    try {
        const data = await req.json();
        console.log(data);
        return NextResponse.json({ message:"user registration request is received" });
    } catch(error) {
        return NextResponse.json({ message:error.message } , { status:404 });
    }
} 