// app/api/auth/login/route.ts - Real database login

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import {
  comparePassword,
  generateJWT,
  sanitizeUser,
  isValidEmail,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Determine if input is email or username
    const isEmail = isValidEmail(email);

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: email.toLowerCase() }
        : { username: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal whether email/username exists
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Compare password with stored hash
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      console.log(`❌ Failed login attempt for: ${user.email}`);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const sanitizedUser = sanitizeUser(user);
    const token = generateJWT(sanitizedUser);

    console.log(`✅ Successful login: ${user.email}`);

    return NextResponse.json({
      success: true,
      token,
      user: sanitizedUser,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
