import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import App from "@/models/app";

export async function GET(request,{ params }) {
    const appid = params.appid;
    await connectMongoDB();
    const app = await App.findOne({ _id: appid });
    return NextResponse.json(app);
}

export async function PUT(request,{ params }) {
    const appid = params.appid;
    const { name, provider } = await request.json();
    await connectMongoDB();
    await App.updateOne({ _id: appid }, { name, provider });
    return NextResponse.json({ message: "App Updated" }, { status: 201 });
}

export async function DELETE(request,{ params }) {
    const appid = params.appid;
    await connectMongoDB();
    await App.deleteOne({ _id: appid });
    return NextResponse.json({ message: "App Deleted" }, { status: 201 });
}