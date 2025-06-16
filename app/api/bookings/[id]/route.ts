// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/constants";

const prisma = new PrismaClient();

// DELETE - Cancel booking
export async function DELETE(
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

    const id = (await params).id;
    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: { event: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (booking.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    // Check if event date has passed
    const eventDate = new Date(booking.event.date);
    const now = new Date();
    if (eventDate < now) {
      return NextResponse.json(
        { success: false, message: "Cannot cancel booking for past events" },
        { status: 400 }
      );
    }

    // Update booking status instead of deleting
    await prisma.booking.update({
      where: { id: id },
      data: { status: BOOKING_STATUS.CANCELLED },
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
