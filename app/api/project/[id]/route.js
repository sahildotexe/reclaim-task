import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import App from "@/models/app";
import User from "@/models/user";

export async function GET(request,{ params }) {
    const id = params.id;
    await connectMongoDB();
    const user = await User.findOne({ _id: id });
    const app_owner = user._id;
    const apps = await App.find({ app_owner });
    return NextResponse.json(apps);
}