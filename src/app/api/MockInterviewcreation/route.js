import { NextResponse } from "next/server";
import connectDB from "../connectDB";
import MockCase from "../models/MockCasesAdd";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const { type, title, scenario, result, exhibit_title, exhibit } = await req.json();

    // Convert single result object to array if needed
    const resultArray = Array.isArray(result) ? result : [result];

    // Validate required fields
    if (!title || !scenario || !type) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Validate result array if provided
    if (
      resultArray &&
      (!Array.isArray(resultArray) ||
        !resultArray.every(
          (item) =>
            item.feedback &&
            ["Excellent", "Good", "Satisfactory", "Average", "Bad"].includes(
              item.feedback
            ) &&
            item.user
        ))
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid result format. Each result must have valid feedback and user ID",
        },
        { status: 400 }
      );
    }

    // Find existing mock case and update by adding new results
    const existingMockCase = await MockCase.findOne({ title: title });

    if (existingMockCase) {
      // Add new results to existing results array
      if (resultArray && resultArray.length > 0) {
        existingMockCase.results.push(...resultArray);
        existingMockCase.updatedAt = new Date();
        // Update exhibit data if provided
        if (exhibit_title) existingMockCase.exhibit_title = exhibit_title;
        if (exhibit) existingMockCase.exhibit = exhibit;
        await existingMockCase.save();
      }

      return NextResponse.json(
        {
          message: "Results added to existing mock case successfully",
          mockCase_id: existingMockCase._id,
        },
        { status: 200 }
      );
    }

    // If no existing case, create new mock case
    const mockCase = new MockCase({
      userId: decodedToken.userId,
      title,
      scenario,
      type,
      exhibit_title,
      exhibit,
      results: resultArray || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to database
    await mockCase.save();

    return NextResponse.json(
      {
        message: "Mock case created successfully",
        mockCase_id: mockCase._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating mock case:", error);
    return NextResponse.json(
      { error: "Failed to create mock case" },
      { status: 500 }
    );
  }
}
