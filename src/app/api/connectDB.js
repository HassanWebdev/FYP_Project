import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return; // If already connected, return
    }

    await mongoose.connect("mongodb+srv://hassanwebdev0896:D7zMKhm8OzzqFGfi@fypproject.p9etg.mongodb.net/FYPProject?retryWrites=true&w=majority&appName=FYPProject");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
