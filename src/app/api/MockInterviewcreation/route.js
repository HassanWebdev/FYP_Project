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

    const { type, title, scenario, result, exhibit_title, exhibit } =
      await req.json();

    const resultArray = Array.isArray(result) ? result : [result];

    if (!title || !scenario || !type) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (
      resultArray &&
      (!Array.isArray(resultArray) ||
        !resultArray.every(
          (item) =>
            item.Success &&
            ["Excellent", "Good", "Satisfactory", "Average", "Bad"].includes(
              item.Success
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

    const existingMockCases = await MockCase.find({ title: title });

    if (existingMockCases && existingMockCases.length > 0) {
      const existingMockCase = existingMockCases[0];
      console.log(existingMockCase);

      if (resultArray && resultArray.length > 0) {
        try {
          const matchingIndex = existingMockCase.results.findIndex(
            (result) =>
              result.user && result.user.toString() === resultArray[0].user
          );

          if (matchingIndex !== -1) {
            existingMockCase.results[matchingIndex] = resultArray[0];
          } else {
            existingMockCase.results.push(...resultArray);
            existingMockCase.updatedAt = new Date();

            if (exhibit_title) existingMockCase.exhibit_title = exhibit_title;
            if (exhibit) existingMockCase.exhibit = exhibit;

            await existingMockCase.save();
            return NextResponse.json(
              {
                message: "Results added to existing mock case successfully",
                mockCase_id: existingMockCase._id,
                allCases: existingMockCases,
              },
              { status: 201 }
            );
          }

          existingMockCase.updatedAt = new Date();

          if (exhibit_title) existingMockCase.exhibit_title = exhibit_title;
          if (exhibit) existingMockCase.exhibit = exhibit;

          await existingMockCase.save();

          return NextResponse.json(
            {
              message: "Results updated in existing mock case successfully",
              mockCase_id: existingMockCase._id,
              allCases: existingMockCases,
            },
            { status: 201 }
          );
        } catch (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
    }
    console.log(resultArray);

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
