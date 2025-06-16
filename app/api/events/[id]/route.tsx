// app/api/events/[id]/route.ts - Updated to work with existing system
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { prisma } from "@/lib/database";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/fileUpload";

// GET - Get single event details (preserving existing functionality)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Event ID is required",
        },
        { status: 400 }
      );
    }

    // Try to get event using existing system first
    try {
      const events = await DatabaseService.getEvents({ limit: 1000 });
      const event = events.find((e) => e.id === id);

      if (event) {
        return NextResponse.json({
          success: true,
          data: event,
        });
      }
    } catch (error) {
      console.log("Falling back to direct database query");
    }

    // Fallback to direct Prisma query for user-created events
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizerUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update event (owner only) - NEW FUNCTIONALITY
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    const { id } = await params;

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

    // Get existing event
    const existingEvent = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    // Check if this is a user-created event that can be edited
    if (!existingEvent.isUserCreated) {
      return NextResponse.json(
        {
          success: false,
          message: "Only user-created events can be edited",
        },
        { status: 403 }
      );
    }

    // Check ownership (only owner or admin can update)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (
      !user ||
      (existingEvent.organizerId !== user.id && user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. You can only edit your own events.",
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract event data
    const eventData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      detailedDescription: formData.get("description") as string, // Use description for compatibility
      shortDesc: formData.get("shortDesc") as string,
      date: formData.get("date") as string, // Keep as string for compatibility
      time: formData.get("time") as string,
      venueName: formData.get("venueName") as string,
      venueAddress: formData.get("venueAddress") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      category: formData.get("category") as string,
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude") as string)
        : null,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude") as string)
        : null,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : 0,
      isFree: formData.get("isFree") === "true",
      maxAttendees: formData.get("maxAttendees")
        ? parseInt(formData.get("maxAttendees") as string)
        : null,
      status: formData.get("status") || existingEvent.status,
      organizer:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username, // Update legacy field
    };

    // Handle image upload if new image provided
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingEvent.imagePath) {
        await deleteFile(existingEvent.imagePath);
      }

      // Upload new image
      const uploadResult = await uploadFile(imageFile);
      if (!uploadResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: uploadResult.error,
          },
          { status: 400 }
        );
      }
      eventData.imageUrl = uploadResult.publicUrl;
      eventData.imagePath = uploadResult.filePath;
    }

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id: id },
      data: eventData,
      include: {
        organizerUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully!",
    });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (owner only) - NEW FUNCTIONALITY
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    const { id } = await params;

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

    // Get existing event
    const existingEvent = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    // Check if this is a user-created event that can be deleted
    if (!existingEvent.isUserCreated) {
      return NextResponse.json(
        {
          success: false,
          message: "Only user-created events can be deleted",
        },
        { status: 403 }
      );
    }

    // Check ownership (only owner or admin can delete)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (
      !user ||
      (existingEvent.organizerId !== user.id && user.role !== "ADMIN")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. You can only delete your own events.",
        },
        { status: 403 }
      );
    }

    // Delete image file if exists
    if (existingEvent.imagePath) {
      await deleteFile(existingEvent.imagePath);
    }

    // Delete event (this will cascade delete bookings)
    await prisma.event.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
      },
      { status: 500 }
    );
  }
}
