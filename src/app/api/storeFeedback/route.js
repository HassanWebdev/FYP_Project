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

    const { result, caseId } = await req.json();

    const findCase = await Interview.findById(caseId);
    if (!findCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    const res = await Interview.findByIdAndUpdate(caseId, {
      result: result,
      status: "completed",
    });

    return NextResponse.json(
      {
        message: "Result added successfully",
        result: res,
        interview_id: caseId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding  result:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
