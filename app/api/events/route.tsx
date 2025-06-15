import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { ApiResponse, Event } from "@/types";

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
