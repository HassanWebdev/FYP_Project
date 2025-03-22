import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../connectDB";
import User from "../../models/UserregisterModal";

export async function POST(req) {
  try {
    const { name, email, password, role, adminKey, phone } = await req.json();
    
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }
    
    await connectDB();

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user", 
    };

    if (role === "admin") {
      userData.adminKey = adminKey;
    }

    const user = await User.create(userData);

    
    const token = jwt.sign({ userId: user._id }, "AABBCCDDEEFFGGHH", {
      expiresIn: "7d",
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
