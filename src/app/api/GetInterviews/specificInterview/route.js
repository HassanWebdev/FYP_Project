import { NextResponse } from "next/server";
import connectToDB from "../../connectDB";
import jwt from "jsonwebtoken";
import Interview from "../../models/InterviewModal";
import MockCase from "../../models/MockCasesAdd";

export async function POST(request) {
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

    // Get interview ID and role from request body
    const { interviewId, role } = await request.json();

    // Choose model based on role
    const Model = role === 'admin' ? MockCase : Interview;

    // Find specific interview/mockcase
    const interview = await Model.findOne({
      _id: interviewId,
      ...(role === 'user' && { userId: userId }) // Only include userId filter for regular users
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: interview },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
