// pages/api/events/search.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  mockEvents,
  getUniqueCities,
  getUniqueStates,
  getUniqueCategories,
} from "@/lib/data";
import { ApiResponse } from "@/types";

interface SearchFilters {
  cities: string[];
  states: string[];
  categories: string[];
  priceRanges: Array<{ label: string; value: string }>;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SearchFilters>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const filters: SearchFilters = {
      cities: getUniqueCities(),
      states: getUniqueStates(),
      categories: getUniqueCategories(),
      priceRanges: [
        { label: "All Events", value: "all" },
        { label: "Free Events", value: "free" },
        { label: "Paid Events", value: "paid" },
      ],
    };

    res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
