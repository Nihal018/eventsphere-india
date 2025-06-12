// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockEvents } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const category = searchParams.get("category");
    const priceRange = searchParams.get("priceRange");

    let filteredEvents = [...mockEvents];

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by city
    if (city && city !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by state
    if (state && state !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Filter by category
    if (category && category !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category
      );
    }

    // Filter by price range
    if (priceRange) {
      if (priceRange === "free") {
        filteredEvents = filteredEvents.filter((event) => event.isFree);
      } else if (priceRange === "paid") {
        filteredEvents = filteredEvents.filter((event) => !event.isFree);
      }
    }

    // Sort by date (upcoming events first)
    filteredEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: filteredEvents,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
