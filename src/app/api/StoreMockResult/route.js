import { NextResponse } from "next/server";
import connectDB from "../connectDB";
import MockCase from "../models/MockCasesAdd";
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

    const { mockInterviewId, result, userId } = await req.json();

    const resultArray = Array.isArray(result) ? result : [result];

    if (!mockInterviewId || !userId) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const existingMockCase = await MockCase.findById(mockInterviewId);

    if (!existingMockCase) {
      return NextResponse.json(
        { error: "Mock interview not found" },
        { status: 404 }
      );
    }

    // Update the status if needed
    if (resultArray.length > 0) {
      existingMockCase.status = "completed";
    }

    // Add the results
    resultArray.forEach((item) => {
      existingMockCase.results.push({
        Success: item.Success || "Bad",
        user: userId,
        AI_Recommendation: item.AI_Recommendation || "",
        AI_Suggestion: item.AI_Suggestion || "",
        Technical: item.Technical || 0,
        Communication: item.Communication || 0,
        ProblemSolving: item.ProblemSolving || 0,
        SoftSkills: item.SoftSkills || 0,
        Leadership: item.Leadership || 0,
      });
    });

    existingMockCase.updatedAt = new Date();
    await existingMockCase.save();

    return NextResponse.json(
      {
        message: "Results stored successfully",
        mockCase: existingMockCase._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing mock result:", error);
    return NextResponse.json(
      { error: "Failed to store mock result" },
      { status: 500 }
    );
  }
}
