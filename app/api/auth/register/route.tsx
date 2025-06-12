// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/data";
import { User } from "@/types";

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

    // Check if user already exists
    const existingUser = mockUsers.find(
      (user) => user.email === email || user.username === username
    );

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email or username",
        },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      username,
      password, // In real app, hash this password
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
    };

    // Add to mock users array
    mockUsers.push(newUser);

    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
