import { NextResponse } from "next/server";
import connectToDB from "../connectDB";
import jwt from "jsonwebtoken";
import MockCase from "../models/MockCasesAdd";

export async function GET(request) {
  try {
    console.log(request);
    // Get token from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    console.log('JWT Secret:', process.env.JWT_SECRET); // Remove this in production
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Connect to database
    await connectToDB();

    // Find all mock cases
    const mockCases = await MockCase.find({}).sort({ createdAt: -1 });

    if (!mockCases) {
      return NextResponse.json(
        { error: "No mock cases found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: mockCases },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Error fetching mock cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock cases" },
      { status: 500 }
    );
  }
}
