"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Shield } from "lucide-react";
import { Event } from "@/types";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show skeleton while hydrating to avoid mismatch
  if (!isClient) {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-0 shadow-md">
        <div className="relative h-48 overflow-hidden bg-gray-200 animate-pulse"></div>
        <CardContent className="p-4">
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if this is a user-created event
  const isUserCreated = event.isUserCreated || event.organizerUser;
  const organizerInfo = event.organizerUser || null;

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-0 shadow-md">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            {event.isFree ? (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                FREE
              </span>
            ) : (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {formatPrice(event.price)}
              </span>
            )}
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
              {event.category}
            </span>
            {/* Show if user-created vs sourced */}
            {isUserCreated && (
              <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <User className="h-3 w-3 mr-1" />
                Created
              </span>
            )}
            {event.isVerified && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Shield className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.shortDesc || event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                {formatDate(event.date)} at {formatTime(event.time)}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span className="line-clamp-1">
                {event.venueName}, {event.city}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between items-center">
              {/* Enhanced organizer info */}
              <div className="flex items-center text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {organizerInfo ? (
                  <span>
                    by{" "}
                    {organizerInfo.firstName && organizerInfo.lastName
                      ? `${organizerInfo.firstName} ${organizerInfo.lastName}`
                      : organizerInfo.username}
                  </span>
                ) : (
                  <span>by {event.organizer}</span>
                )}
                {isUserCreated && (
                  <span className="ml-2 bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-xs">
                    Organizer
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {event.tags &&
                Array.isArray(event.tags) &&
                event.tags.length > 0 ? (
                  event.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {event.sourceName || "Curated"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
