import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, email } = await request.json();
  await connectMongoDB();
  await User.create({ name, email });
  return NextResponse.json({ message: "User Registered" }, { status: 201 });
}

export async function GET(request) {  
  const email = request.headers.get("user-email");
  await connectMongoDB();
  const user = await User.findOne({ email });
  return NextResponse.json(user);
}