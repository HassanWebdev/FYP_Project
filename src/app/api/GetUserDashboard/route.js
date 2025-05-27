import { NextResponse } from "next/server";
import connectToDB from "../connectDB";
import jwt from "jsonwebtoken";
import Interview from "../models/InterviewModal";
import MockInterview from "../models/MockCasesAdd";

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

    await connectToDB();

    const totalInterviews = await Interview.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    const userOwn = await Interview.find({
      userId: userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const adminOwn = await MockInterview.find({
      "results.user": userId,
    }).sort({ createdAt: -1 });
    const completedInterviews = [...userOwn, ...adminOwn];

    console.log("Total Interviews:", totalInterviews.length);
    console.log("Completed Interviews:", completedInterviews.length);

    // Calculate completion percentage
    let completionPercentage = 0;
    if (totalInterviews.length > 0) {
      completionPercentage = Math.round(
        (completedInterviews.length / totalInterviews.length) * 100
      );
    }

    // Calculate success rating statistics for donut chart
    const ratingCounts = {
      Excellent: 0,
      Good: 0,
      Satisfactory: 0,
      Average: 0,
      Bad: 0,
    };

    let totalResults = 0;

    // Iterate through all completed interviews and count each rating
    completedInterviews.forEach((interview) => {
      if (interview.result && interview.result.Success) {
        if (ratingCounts.hasOwnProperty(interview.result.Success)) {
          ratingCounts[interview.result.Success]++;
          totalResults++;
        }
      }
    });

    // Calculate percentages for each rating
    const ratingPercentages = {};
    const ratingValues = [];

    if (totalResults > 0) {
      Object.keys(ratingCounts).forEach((rating) => {
        const percentage = Math.round(
          (ratingCounts[rating] / totalResults) * 100
        );
        ratingPercentages[rating] = percentage;
        ratingValues.push(percentage);
      });
    }

    // Calculate success rate (percentage of Excellent or Good ratings)
    let successRate = 0;
    if (totalResults > 0) {
      const successfulInterviews = ratingCounts.Excellent + ratingCounts.Good;
      successRate = Math.round((successfulInterviews / totalResults) * 100);
    }

    // Calculate average rating
    let averageRating = 0;
    if (totalResults > 0) {
      // Assign numerical values to ratings
      const ratingValues = {
        Excellent: 5,
        Good: 4,
        Satisfactory: 3,
        Average: 2,
        Bad: 1,
      };

      let totalRatingScore = 0;

      // Calculate total score
      completedInterviews.forEach((interview) => {
        if (interview.result && interview.result.Success) {
          totalRatingScore += ratingValues[interview.result.Success] || 0;
        }
      });

      // Calculate average and round to 1 decimal place
      averageRating = Math.round((totalRatingScore / totalResults) * 10) / 10;
    }

    // Add skill average calculations
    const skillAverages = {
      Technical: 0,
      Communication: 0,
      ProblemSolving: 0,
      SoftSkills: 0,
      Leadership: 0,
    };

    let totalSkillResults = 0;

    // Calculate average for each skill across all completed interviews
    completedInterviews.forEach((interview) => {
      if (interview.result) {
        if (
          interview.result.Technical ||
          interview.result.Communication ||
          interview.result.ProblemSolving ||
          interview.result.SoftSkills ||
          interview.result.Leadership
        ) {
          totalSkillResults++;
          skillAverages.Technical += interview.result.Technical || 0;
          skillAverages.Communication += interview.result.Communication || 0;
          skillAverages.ProblemSolving += interview.result.ProblemSolving || 0;
          skillAverages.SoftSkills += interview.result.SoftSkills || 0;
          skillAverages.Leadership += interview.result.Leadership || 0;
        }
      }
    });

    // Calculate the averages if there are any skill results
    if (totalSkillResults > 0) {
      Object.keys(skillAverages).forEach((skill) => {
        skillAverages[skill] = Math.round(
          skillAverages[skill] / totalSkillResults
        );
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          totalInterviews,
          completedInterviews,
          completionPercentage,
          successRate,
          averageRating,
          ratingStats: {
            counts: ratingCounts,
            percentages: ratingPercentages,
            donutChartData: ratingValues,
          },
          skillAverages,
        },
      },
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
