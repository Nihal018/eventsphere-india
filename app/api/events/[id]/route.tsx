// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockEvents } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Event ID is required",
        },
        { status: 400 }
      );
    }

    const event = mockEvents.find((e) => e.id === id);

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
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
