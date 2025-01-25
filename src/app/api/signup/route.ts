import {connect} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Admin from "@/models/adminModel";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {name, email, password} = reqBody
        const user = await Admin.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        console.log(password);

        const newUser = new Admin({
            name,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}