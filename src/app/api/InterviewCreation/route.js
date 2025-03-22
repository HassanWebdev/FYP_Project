import { NextResponse } from "next/server";
import connectDB from "../connectDB";
import Interview from "../models/InterviewModal";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();

    
    const interview = new Interview({
      title: data.title,
      scenario: data.scenario,
      userId: decodedToken.userId, 
      feedback: data.feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
      isInterviewed: false,
      interviewDate: null,
      duration: 0,
    });

    
    await interview.save();

    return NextResponse.json(
      { 
        message: "Interview created successfully", 
        interview_id: interview._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
