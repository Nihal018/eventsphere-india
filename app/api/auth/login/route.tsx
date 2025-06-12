// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/data";

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

    // Find user by email or username
    const user = mockUsers.find(
      (u) =>
        (u.email === email || u.username === email) && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Generate a simple token (in real app, use proper JWT)
    const token = `eventsphere_token_${user.id}_${Date.now()}`;

    // Return success without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: "Login successful",
    });
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
