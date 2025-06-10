import { NextApiRequest, NextApiResponse } from "next";
import { mockEvents } from "@/lib/data";
import { Event, ApiResponse } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Event[]>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { search, city, state, category, priceRange } = req.query;

    let filteredEvents = [...mockEvents];

    // Filter by search term
    if (search && typeof search === "string") {
      const searchTerm = search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by city
    if (city && typeof city === "string" && city !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by state
    if (state && typeof state === "string" && state !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Filter by category
    if (category && typeof category === "string" && category !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category
      );
    }

    // Filter by price range
    if (priceRange && typeof priceRange === "string") {
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

    res.status(200).json({
      success: true,
      data: filteredEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
