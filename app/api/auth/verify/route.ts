// app/api/auth/verify/route.ts - Token verification endpoint

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { verifyJWT, extractTokenFromHeader, sanitizeUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
        },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // Get current user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    const sanitizedUser = sanitizeUser(user);

    return NextResponse.json({
      success: true,
      user: sanitizedUser,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Token verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Token verification failed",
      },
      { status: 401 }
    );
  }
}
