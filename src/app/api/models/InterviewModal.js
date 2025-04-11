const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  scenario: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  result: {
    Success: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Satisfactory", "Bad"],
    },
    AI_Recommendation: {
      type: String,
    },
    AI_Suggestion: {
      type: String,
    },
    Technical: {
      type: Number,
    },
    Communication: {
      type: Number,
    },
    ProblemSolving: {
      type: Number,
    },
    SoftSkills: {
      type: Number,
    },
    Leadership: {
      type: Number,
    },
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  isInterviewed: {
    type: Boolean,
    default: false,
  },
  interviewDate: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

interviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Interview =
  mongoose.models.Interview || mongoose.model("Interview", interviewSchema);
export default Interview;
