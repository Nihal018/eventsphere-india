// app/api/auth/logout/route.ts - Logout endpoint

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // For JWT-based auth, logout is handled client-side by removing the token
    // In a more complex system, you might maintain a blacklist of tokens

    console.log("✅ User logged out");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    );
  }
}
