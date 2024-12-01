import { NextResponse } from "next/server";
import connectToDB from "../connectDB";
import jwt from "jsonwebtoken";
import Interview from "../models/InterviewModal";

export async function GET(request) {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Connect to database
    await connectToDB();

    // Find all interviews for the user, sorted by createdAt in descending order
    const interviews = await Interview.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: interviews },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
