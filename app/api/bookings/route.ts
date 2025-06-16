// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { BOOKING_STATUS } from "@/lib/constants";

const prisma = new PrismaClient();

// POST - Create booking
export async function POST(request: NextRequest) {
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

    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { bookings: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    if (event.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, message: "Event is not available for booking" },
        { status: 400 }
      );
    }

    // Check capacity
    if (event.maxAttendees && event._count.bookings >= event.maxAttendees) {
      return NextResponse.json(
        { success: false, message: "Event is fully booked" },
        { status: 400 }
      );
    }

    // Check for existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: eventId,
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { success: false, message: "You have already booked this event" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: decoded.userId,
        eventId: eventId,
        status: BOOKING_STATUS.CONFIRMED,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            venueName: true,
            city: true,
            price: true,
            isFree: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Event booked successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - Get user's bookings
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

    const bookings = await prisma.booking.findMany({
      where: { userId: decoded.userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            venueName: true,
            venueAddress: true,
            city: true,
            state: true,
            price: true,
            isFree: true,
            imageUrl: true,
            category: true,
            organizer: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
