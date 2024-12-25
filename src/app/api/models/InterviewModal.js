const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  scenario: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  result: {
    Success: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Satisfactory', 'Bad'],
      default: ' '
    },
    AI_Recommendation: {
      type: String,
      default: ''
    },
    AI_Suggestion: {
      type: String,
      default: ''
    },
    Technical: {
      type: Number,
      default: 0
    },
    Communication: {
      type: Number,
      default: 0
    },
    ProblemSolving: {
      type: Number,
      default: 0
    },
    SoftSkills: {
      type: Number,
      default: 0
    },
    Leadership: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  isInterviewed: {
    type: Boolean,
    default: false
  },
  interviewDate: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
interviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Interview = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
export default Interview;