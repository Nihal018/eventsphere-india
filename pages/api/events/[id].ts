// pages/api/events/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { mockEvents } from "@/lib/data";
import { Event, ApiResponse } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Event>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Event ID is required",
      });
    }

    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
