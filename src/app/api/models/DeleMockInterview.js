import mongoose from "mongoose";

const deleteMockInterviewSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MockCase"
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// Create model if it doesn't exist
const DeleteMockInterview = mongoose.models.DeleteMockInterview || mongoose.model("DeleteMockInterview", deleteMockInterviewSchema);

export default DeleteMockInterview;

