// app/api/events/route.ts - Updated to preserve existing functionality
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { ApiResponse, Event } from "@/types";
import { prisma } from "@/lib/database";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { uploadFile } from "@/lib/fileUpload";

// GET - Fetch all events (existing functionality preserved)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      search: searchParams.get("search") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      category: searchParams.get("category") || undefined,
      source: searchParams.get("source") || undefined,
      limit: parseInt(searchParams.get("limit") || "100"),
    };

    // Remove empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    console.log("🔍 Fetching events with filters:", filters);

    // Use existing DatabaseService for compatibility
    const events = await DatabaseService.getEvents(filters);

    // Apply additional client-side filters for compatibility
    let filteredEvents = [...events];

    // Filter by price range
    const priceRange = searchParams.get("priceRange");
    if (priceRange === "free") {
      filteredEvents = filteredEvents.filter((event) => event.isFree);
    } else if (priceRange === "paid") {
      filteredEvents = filteredEvents.filter((event) => !event.isFree);
    }

    // Sort by date (upcoming events first)
    filteredEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    console.log(`✅ Returning ${filteredEvents.length} events`);

    const response: ApiResponse<Event[]> = {
      success: true,
      data: filteredEvents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching events:", error);

    const response: ApiResponse<Event[]> = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new event (organizers only) - NEW FUNCTIONALITY
export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();

    // Extract event data
    const eventData = {
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
      status: (formData.get("status") as "DRAFT" | "PUBLISHED") || "DRAFT",
    };

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "venueName",
      "venueAddress",
      "city",
      "state",
      "category",
    ];
    for (const field of requiredFields) {
      if (!eventData[field as keyof typeof eventData]) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Handle image upload
    let imageUrl = null;
    let imagePath = null;
    const imageFile = formData.get("image") as File;

    if (imageFile && imageFile.size > 0) {
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
      imageUrl = uploadResult.publicUrl;
      imagePath = uploadResult.filePath;
    }

    // Create event with both new and legacy fields
    const event = await prisma.event.create({
      data: {
        ...eventData,
        imageUrl,
        imagePath,
        organizerId: user.id, // New field
        organizer:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.username, // Legacy field
        isUserCreated: true, // Mark as user-created
        tags: JSON.stringify([]), // Empty tags array
        aggregationScore: 100, // High score for user-created events
        isVerified: true, // User-created events are verified
      },
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

    return NextResponse.json(
      {
        success: true,
        data: event,
        message: "Event created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
      },
      { status: 500 }
    );
  }
}
