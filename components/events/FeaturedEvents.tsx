// components/events/FeaturedEvents.tsx
import React from "react";
import EventCard from "./EventCard";
import { Event } from "@/types";

interface FeaturedEventsProps {
  events: Event[];
}

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  const featuredEvents = events.slice(0, 3);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing upcoming events happening across
            India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
