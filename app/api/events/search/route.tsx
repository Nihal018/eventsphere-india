// app/api/events/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getUniqueCities,
  getUniqueStates,
  getUniqueCategories,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const filters = {
      cities: getUniqueCities(),
      states: getUniqueStates(),
      categories: getUniqueCategories(),
      priceRanges: [
        { label: "All Events", value: "all" },
        { label: "Free Events", value: "free" },
        { label: "Paid Events", value: "paid" },
      ],
    };

    return NextResponse.json({
      success: true,
      data: filters,
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
