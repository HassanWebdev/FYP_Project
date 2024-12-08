import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  adminKey: {
    type: String,
    required: function() {
      return this.role === 'admin';
    },
    select: false // Don't include in query results by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  }
});

// Create model if it doesn't exist 
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
