import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import App from "@/models/app";
import User from "@/models/user";


export async function POST(request) {
    const { name, provider,email } = await request.json();
    const api_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await connectMongoDB();
    const owner = await User.findOne({ email });
    console.log(owner);
    const app_owner = owner._id;
    await App.create({ name, provider, api_key, app_owner });
    return NextResponse.json({ message: "App Registered", data: { name, provider, api_key, app_owner } }, { status: 201 });
}

export async function GET(request) {
    const email = request.headers.get("user-email");
    await connectMongoDB();
    const user = await User.findOne({ email });
    const app_owner = user._id; 
    const apps = await App.find({ app_owner });
    return NextResponse.json(apps);
}