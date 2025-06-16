// app/api/admin/events/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Await params before accessing properties
    const { id } = await params;

    const { status } = await request.json();

    if (!["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await prisma.event.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Event status updated successfully",
    });
  } catch (error) {
    console.error("Update event status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
