import mongoose from "mongoose";

const mockCaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    trim: true,
  },
  scenario: {
    type: String,
  },
  exhibit_title: {
    type: String,
    trim: true,
  },
  exhibit: {
    type: Array,
  },
  results: [
    {
      Success: {
        type: String,
        enum: ["Excellent", "Good", "Satisfactory", "Average", "Bad"],
        default: "Bad",
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      AI_Recommendation: {
        type: String,
        default: "",
      },
      AI_Suggestion: {
        type: String,
        default: "",
      },
      Technical: {
        type: Number,
        default: 0,
      },
      Communication: {
        type: Number,
        default: 0,
      },
      ProblemSolving: {
        type: Number,
        default: 0,
      },
      SoftSkills: {
        type: Number,
        default: 0,
      },
      Leadership: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
  },
});

// Create model if it doesn't exist
const MockCase =
  mongoose.models.MockCase || mongoose.model("MockCase", mockCaseSchema);

export default MockCase;
