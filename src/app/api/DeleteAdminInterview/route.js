import { NextResponse } from "next/server";
import connectDB from "../connectDB";
import jwt from "jsonwebtoken";
import MockCasesAdd from "../models/MockCasesAdd";

export async function POST(req) {
  try {
    
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    
    const deletedCase = await MockCasesAdd.findByIdAndDelete(id);

    if (!deletedCase) {
      return NextResponse.json(
        { message: "Mock case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Mock case deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting mock case:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
