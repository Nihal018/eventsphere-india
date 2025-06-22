// app/api/events/route.ts - Updated with pagination support
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { ApiResponse, Event, PaginatedApiResponse } from "@/types";
import { prisma } from "@/lib/database";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { uploadFile } from "@/lib/fileUpload";

// GET - Fetch all events with pagination support
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    // Filter parameters
    const filters = {
      search: searchParams.get("search") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      category: searchParams.get("category") || undefined,
      source: searchParams.get("source") || undefined,
      priceRange: searchParams.get("priceRange") || undefined,
    };

    // Remove empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    console.log(
      "🔍 Fetching events with filters:",
      filters,
      "Page:",
      page,
      "Limit:",
      limit
    );

    // Build Prisma where clause
    const where: any = {
      AND: [
        // Search filter
        filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                {
                  description: {
                    contains: filters.search,
                    mode: "insensitive",
                  },
                },
                { tags: { hasSome: [filters.search] } },
              ],
            }
          : {},

        // City filter
        filters.city
          ? { city: { equals: filters.city, mode: "insensitive" } }
          : {},

        // State filter
        filters.state
          ? { state: { equals: filters.state, mode: "insensitive" } }
          : {},

        // Category filter
        filters.category ? { category: { equals: filters.category } } : {},

        // Source filter
        filters.source ? { source: { equals: filters.source } } : {},

        // Price filter
        filters.priceRange === "free"
          ? { isFree: true }
          : filters.priceRange === "paid"
          ? { isFree: false }
          : {},

        // Only show future events
        { date: { gte: new Date().toISOString() } },
      ],
    };

    // Execute queries in parallel for better performance
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          detailedDescription: true,
          shortDesc: true,
          date: true,
          time: true,
          venueName: true,
          venueAddress: true,
          city: true,
          state: true,
          imageUrl: true,
          price: true,
          isFree: true,
          latitude: true,
          longitude: true,
          category: true,
          tags: true,
          sourceUrl: true,
          organizer: true,
          organizerId: true,
          isUserCreated: true,
          createdAt: true,
          updatedAt: true,
          organizerUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    // Transform tags if they're stored as JSON strings
    const transformedEvents = events.map((event) => ({
      ...event,
      tags:
        typeof event.tags === "string" ? JSON.parse(event.tags) : event.tags,
    }));

    console.log(
      `✅ Returning ${transformedEvents.length} of ${totalCount} total events (Page ${page})`
    );

    const response: PaginatedApiResponse<Event[]> = {
      success: true,
      data: transformedEvents,
      total: totalCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching events:", error);

    // Fallback to old method if Prisma query fails
    try {
      console.log("Falling back to DatabaseService.getEvents()");
      const allEvents = await DatabaseService.getEvents({ limit: 1000 });

      // Recreate searchParams from request.url
      const { searchParams } = new URL(request.url);

      // Apply filters manually
      let filteredEvents = [...allEvents];

      // Apply search filter
      if (searchParams.get("search")) {
        const search = searchParams.get("search")!.toLowerCase();
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(search) ||
            event.description.toLowerCase().includes(search) ||
            (Array.isArray(event.tags) &&
              event.tags.some((tag) => tag.toLowerCase().includes(search)))
        );
      }

      // Apply other filters
      if (searchParams.get("city")) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.city.toLowerCase() === searchParams.get("city")!.toLowerCase()
        );
      }

      if (searchParams.get("state")) {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.state.toLowerCase() ===
            searchParams.get("state")!.toLowerCase()
        );
      }

      if (searchParams.get("category")) {
        filteredEvents = filteredEvents.filter(
          (event) => event.category === searchParams.get("category")
        );
      }

      const priceRange = searchParams.get("priceRange");
      if (priceRange === "free") {
        filteredEvents = filteredEvents.filter((event) => event.isFree);
      } else if (priceRange === "paid") {
        filteredEvents = filteredEvents.filter((event) => !event.isFree);
      }

      // Sort by date
      filteredEvents.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Apply pagination
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "12", 10);
      const start = (page - 1) * limit;
      const paginatedEvents = filteredEvents.slice(start, start + limit);

      const response: PaginatedApiResponse<Event[]> = {
        success: true,
        data: paginatedEvents,
        total: filteredEvents.length,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredEvents.length / limit),
          totalCount: filteredEvents.length,
          limit,
          hasNextPage: page < Math.ceil(filteredEvents.length / limit),
          hasPreviousPage: page > 1,
        },
      };

      return NextResponse.json(response);
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);

      const response: PaginatedApiResponse<Event[]> = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        data: [],
        total: 0,
      };

      return NextResponse.json(response, { status: 500 });
    }
  }
}

// POST - Create new event (organizers only) - EXISTING FUNCTIONALITY PRESERVED
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
