// app/api/organizer/events/route.ts - Works with existing database structure
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Fetch organizer's events
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);

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
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Get user and check role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        {
          success: false,
          message: "Organizer access required",
        },
        { status: 403 }
      );
    }

    // Get organizer's events (only user-created events)
    const events = await prisma.event.findMany({
      where: {
        organizerId: user.id,
        isUserCreated: true, // Only show user-created events
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get event statistics
    const stats = {
      total: events.length,
      published: events.filter((e) => e.status === "PUBLISHED").length,
      draft: events.filter((e) => e.status === "DRAFT").length,
      cancelled: events.filter((e) => e.status === "CANCELLED").length,
      completed: events.filter((e) => e.status === "COMPLETED").length,
      totalBookings: events.reduce((sum, e) => sum + e._count.bookings, 0),
    };

    return NextResponse.json({
      success: true,
      events,
      stats,
    });
  } catch (error) {
    console.error("Get organizer events error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
