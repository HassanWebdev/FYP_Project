import { NextResponse } from "next/server";
import connectToDB from "../connectDB";
import jwt from "jsonwebtoken";
import Interview from "../models/InterviewModal";
import MockInterview from "../models/MockCasesAdd";
import User from "../models/UserregisterModal";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const getUserRole = await User.findById(userId);
    console.log("User Role:", getUserRole.role);

    await connectToDB();

    const mockInterviews = await Interview.find({
      userId: userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const adminInterviews =
      getUserRole.role === "admin"
        ? await MockInterview.find({
            userId: userId,
            status: "completed",
          }).sort({ createdAt: -1 })
        : await MockInterview.find({
            "results.user": userId,
          }).sort({ createdAt: -1 });

    const totalInterviews = [...mockInterviews, ...adminInterviews];

    console.log(adminInterviews);

    return NextResponse.json(
      { success: true, data: totalInterviews },
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
