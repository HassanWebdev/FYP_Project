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
  feedback: {
    type: String,
    default: ""
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
    type: Number, // Duration in minutes
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