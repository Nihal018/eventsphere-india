"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Navigation,
  IndianRupee,
  Tag,
} from "lucide-react";
import { Event } from "@/types";
import { mockEvents } from "@/lib/data";
import {
  formatDate,
  formatTime,
  formatPrice,
  getDirectionsWithLocation,
  isAuthenticated,
} from "@/lib/utils";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [gettingDirections, setGettingDirections] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const eventId = params.id as string;
    if (eventId) {
      // Simulate API call
      const loadEvent = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        const foundEvent = mockEvents.find((e) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        }
        setLoading(false);
      };

      loadEvent();
    }
  }, [params.id]);

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Store booking details in session storage for checkout
    if (event) {
      const bookingDetails = {
        eventId: event.id,
        eventTitle: event.title,
        price: event.price,
        date: event.date,
        time: event.time,
        venueName: event.venueName,
      };
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      router.push("/checkout");
    }
  };

  const handleGetDirections = async () => {
    if (!event) return;

    setGettingDirections(true);

    try {
      // Show initial message
      showToast("Requesting location permission...", "info");

      // Use enhanced directions function that requests location permission
      await getDirectionsWithLocation(
        event.latitude,
        event.longitude,
        event.venueAddress
      );

      showToast("Opening directions in Google Maps!", "success");
    } catch (error) {
      console.error("Error getting directions:", error);
      showToast(
        "Location access denied. Opening maps without current location.",
        "info"
      );
    } finally {
      setGettingDirections(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
        showToast("Event shared successfully!", "success");
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showToast("Event link copied to clipboard!", "success");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      showToast("Unable to share event. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-300"></div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-20 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 bg-gray-300 rounded"></div>
            </div>
            <div className="h-60 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/events")}>
            Browse Other Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold capitalize mb-2 inline-block">
              {event.category}
            </span>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-xl text-gray-200">by {event.organizer}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Event
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {event.detailedDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="text-center mb-6">
                  {event.isFree ? (
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      FREE
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrice(event.price)}
                    </div>
                  )}
                  <p className="text-gray-600">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        {formatDate(event.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">{event.venueName}</div>
                      <div className="text-sm text-gray-500">
                        {event.venueAddress}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.city}, {event.state}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleBookNow} className="w-full" size="lg">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>

                  <Button
                    onClick={handleGetDirections}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={gettingDirections}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {gettingDirections
                      ? "Getting Location..."
                      : "Get Directions"}
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="w-full"
                    size="lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                </div>

                {/* Enhanced Location Permission Notice */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <Navigation className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-800 font-medium">
                        Smart Directions
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Click "Get Directions" and allow location access for
                        turn-by-turn directions from your current location!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
