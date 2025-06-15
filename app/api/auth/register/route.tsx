import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import {
  hashPassword,
  generateJWT,
  sanitizeUser,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, firstName, lastName, phone } =
      await request.json();

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, username, and password are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate username
    const usernameValidation = isValidUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: usernameValidation.message,
        },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.message,
        },
        { status: 400 }
      );
    }

    // Check if user already exists (email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase() ? "email" : "username";
      return NextResponse.json(
        {
          success: false,
          message: `A user with this ${field} already exists`,
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        phone: phone?.trim() || null,
      },
    });

    // Generate JWT token
    const sanitizedUser = sanitizeUser(newUser);
    const token = generateJWT(sanitizedUser);

    console.log(`✅ New user registered: ${newUser.email}`);

    return NextResponse.json(
      {
        success: true,
        token,
        user: sanitizedUser,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            success: false,
            message: "A user with this email or username already exists",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
