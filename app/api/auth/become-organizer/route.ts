// app/api/auth/become-organizer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    console.log("Auth header:", authHeader);
    console.log("Extracted token:", token);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    console.log("Decoded JWT payload:", decoded);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    console.log("Decoded JWT:", decoded);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if already an organizer
    if (user.role === "ORGANIZER" || user.role === "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "You are already an organizer!",
        },
        { status: 400 }
      );
    }

    // Upgrade to organizer role (automatic approval)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ORGANIZER" },
    });

    // Return success without password
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message:
        "Congratulations! You are now an event organizer. You can start creating events!",
    });
  } catch (error) {
    console.error("Become organizer error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upgrade to organizer",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
