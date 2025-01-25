import { connect } from "@/dbConfig/dbConfig";
import Data from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {name, dob} = reqBody;
        console.log(reqBody);
    
        const newData = new Data({
            name,
            dob
        })
        const savedData = await newData.save();
        return NextResponse.json({
            message: "Data added successfully",
            success: true,
            savedData
        }, { status: 200 })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const data = await Data.find();
        return NextResponse.json({ success: true, data }, { status: 200 }); 
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id"); 
        const deletedData = await Data.findByIdAndDelete(id);
        return NextResponse.json({ data: deletedData }, { status: 200 });

    }  catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { _id, ...rest } = body;
        console.log(_id);
        if (!_id) {
            return NextResponse.json({ error: "Missing required field: _id" }, { status: 400 });
        }
        const updatedClientSite = await Data.findByIdAndUpdate(
            _id,
            { ...rest },
            { new: true, runValidators: true }
        );
        if (!updatedClientSite) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }
        return NextResponse.json({ data: updatedClientSite }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}