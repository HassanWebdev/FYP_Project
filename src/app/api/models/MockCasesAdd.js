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
      feedback: {
        type: String,
        enum: ["Excellent", "Good", "Satisfactory", "Average", "Bad"],
        default: "Satisfactory",
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
