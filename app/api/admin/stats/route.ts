// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    // Get stats
    const [
      totalUsers,
      organizers,
      totalEvents,
      userCreatedEvents,
      totalBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ORGANIZER" } }),
      prisma.event.count(),
      prisma.event.count({ where: { isUserCreated: true } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
    ]);

    const aggregatedEvents = totalEvents - userCreatedEvents;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        organizers,
        totalEvents,
        userCreatedEvents,
        aggregatedEvents,
        totalBookings,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
