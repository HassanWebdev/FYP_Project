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

    // const mockInterviews = await Interview.find({
    //   userId: userId,
    //   status: "completed",
    // }).sort({ createdAt: -1 });
    const adminInterviews = await MockInterview.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    const totalInterviews = [...adminInterviews];
    const completedInterviews = await MockInterview.find({
      userId: userId,
      status: "completed",
    }).sort({ createdAt: -1 });
    
    // Calculate completion percentage
    let completionPercentage = 0;
    if (totalInterviews.length > 0) {
      completionPercentage = Math.round((completedInterviews.length / totalInterviews.length) * 100);
    }
    
    // Calculate success rating statistics for donut chart
    const ratingCounts = {
      Excellent: 0,
      Good: 0,
      Satisfactory: 0,
      Average: 0,
      Bad: 0
    };
    
    let totalResults = 0;
    
    // Iterate through all completed interviews and count each rating
    completedInterviews.forEach(interview => {
      if (interview.results && interview.results.length > 0) {
        interview.results.forEach(result => {
          if (result.Success && ratingCounts.hasOwnProperty(result.Success)) {
            ratingCounts[result.Success]++;
            totalResults++;
          }
        });
      }
    });
    
    // Calculate percentages for each rating
    const ratingPercentages = {};
    const ratingValues = [];
    
    if (totalResults > 0) {
      Object.keys(ratingCounts).forEach(rating => {
        const percentage = Math.round((ratingCounts[rating] / totalResults) * 100);
        ratingPercentages[rating] = percentage;
        ratingValues.push(percentage);
      });
    }
    
    // Add skill average calculations
    const skillAverages = {
      Technical: 0,
      Communication: 0,
      ProblemSolving: 0,
      SoftSkills: 0,
      Leadership: 0
    };
    
    let totalSkillResults = 0;
    
    // Calculate average for each skill across all completed interviews
    completedInterviews.forEach(interview => {
      if (interview.results && interview.results.length > 0) {
        interview.results.forEach(result => {
          if (result.Technical || result.Communication || 
              result.ProblemSolving || result.SoftSkills || 
              result.Leadership) {
            totalSkillResults++;
            skillAverages.Technical += result.Technical || 0;
            skillAverages.Communication += result.Communication || 0;
            skillAverages.ProblemSolving += result.ProblemSolving || 0;
            skillAverages.SoftSkills += result.SoftSkills || 0;
            skillAverages.Leadership += result.Leadership || 0;
          }
        });
      }
    });
    
    // Calculate the averages if there are any skill results
    if (totalSkillResults > 0) {
      Object.keys(skillAverages).forEach(skill => {
        skillAverages[skill] = Math.round(skillAverages[skill] / totalSkillResults);
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          totalInterviews, 
          completedInterviews, 
          completionPercentage,
          ratingStats: {
            counts: ratingCounts,
            percentages: ratingPercentages,
            donutChartData: ratingValues
          },
          skillAverages
        } 
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
