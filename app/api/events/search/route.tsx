// app/api/events/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getUniqueCities,
  getUniqueStates,
  getUniqueCategories,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    // Get unique values from your data functions
    const cities = getUniqueCities();
    const states = getUniqueStates();
    const categories = getUniqueCategories();

    return NextResponse.json({
      success: true,
      cities: cities.sort(),
      states: states.sort(),
      categories: categories.sort(),
      priceRanges: [
        { label: "All Events", value: "all" },
        { label: "Free Events", value: "free" },
        { label: "Paid Events", value: "paid" },
      ],
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch filter options",
        cities: [],
        states: [],
        categories: [],
      },
      { status: 500 }
    );
  }
}
