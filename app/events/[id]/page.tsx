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
  ExternalLink,
  Shield,
  Star,
  ArrowLeft,
  User,
  Edit,
  Crown,
  CheckCircle,
  X,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  formatPrice,
  getDirectionsWithLocation,
  isAuthenticated,
} from "@/lib/utils";
import Header from "../../../components/layout/Header";

interface Event {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  shortDesc?: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  imageUrl?: string;
  imagePath?: string;
  price: number;
  isFree: boolean;
  latitude?: number;
  longitude?: number;
  category: string;
  organizer: string;
  tags: string[];
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  isVerified: boolean;
  aggregationScore: number;
  isUserCreated?: boolean;
  organizerId?: string;
  organizerUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  status?: string;
  maxAttendees?: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [gettingDirections, setGettingDirections] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showToast, ToastContainer } = useToast();
  const [userBookingId, setUserBookingId] = useState<string | null>(null);

  const [hasBooked, setHasBooked] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(true);

  useEffect(() => {
    // Get current user ID from token
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);

        // Try direct API call first for user-created events
        let response = await fetch(`/api/events/${params.id}`);
        let data = await response.json();

        if (data.success) {
          setEvent(data.data);
          return;
        }

        // Fallback to fetching all events
        response = await fetch("/api/events");
        data = await response.json();

        if (data.success) {
          const foundEvent = data.data.find((e: Event) => e.id === params.id);
          if (foundEvent) {
            setEvent(foundEvent);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  useEffect(() => {
    const checkExistingBooking = async () => {
      if (!isAuthenticated() || !event) return;

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          const existingBooking = data.data.find(
            (booking: any) =>
              booking.event.id === event.id && booking.status === "CONFIRMED"
          );
          if (existingBooking) {
            setHasBooked(true);
            setUserBookingId(existingBooking.id); // Store the booking ID
          } else {
            setHasBooked(false);
            setUserBookingId(null);
          }
        }
      } catch (error) {
        console.error("Error checking booking:", error);
      } finally {
        setCheckingBooking(false);
      }
    };

    checkExistingBooking();
  }, [event]);

  const handleBookNow = async () => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!event) {
        showToast("Event not found", "error");
        return;
      }
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Event booked successfully! 🎉", "success");

        const bookingDetails = {
          eventId: event.id,
          eventTitle: event.title,
          price: event.price,
          date: event.date,
          time: event.time,
          venueName: event.venueName,
        };
        sessionStorage.setItem(
          "bookingDetails",
          JSON.stringify(bookingDetails)
        );
        router.push("/checkout");
      } else {
        showToast(data.message || "Failed to book event", "error");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showToast("An error occurred while booking the event", "error");
    }
  };

  // const handleBookNow = () => {
  //   if (!isAuthenticated()) {
  //     router.push("/auth/login");
  //     return;
  //   }

  //   // Store booking details in session storage for checkout
  //   if (event) {
  //     const bookingDetails = {
  //       eventId: event.id,
  //       eventTitle: event.title,
  //       price: event.price,
  //       date: event.date,
  //       time: event.time,
  //       venueName: event.venueName,
  //     };
  //     sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  //     router.push("/checkout");
  //   }
  // };

  const handleGetDirections = async () => {
    if (!event) return;

    setGettingDirections(true);

    try {
      showToast("Requesting location permission...", "info");

      if (event.latitude && event.longitude) {
        await getDirectionsWithLocation(
          event.latitude,
          event.longitude,
          event.venueAddress
        );
      } else {
        // Fallback to address-based directions
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          event.venueAddress + ", " + event.city
        )}`;
        window.open(mapsUrl, "_blank");
      }

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
        await navigator.clipboard.writeText(window.location.href);
        showToast("Event link copied to clipboard!", "success");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      showToast("Unable to share event. Please try again.", "error");
    }
  };

  const getSourceBadgeColor = (source?: string) => {
    switch (source) {
      case "ticketmaster":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "predicthq":
        return "bg-green-100 text-green-800 border-green-200";
      case "allevents":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "enhanced_mock":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const handleCancelBooking = async () => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    if (!userBookingId) {
      showToast("No booking found to cancel", "error");
      return;
    }

    // Confirmation dialog
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      // Use the booking ID, not the event ID
      const response = await fetch(`/api/bookings/${userBookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        showToast("Booking cancelled successfully! 🚫", "success");
        setHasBooked(false);
        setUserBookingId(null);
        // Optional: refresh the page to update any other booking-related UI
        // router.refresh();
      } else {
        showToast(data.message || "Failed to cancel booking", "error");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showToast("An error occurred while cancelling the booking", "error");
    }
  };

  // Check if current user owns this event
  const isEventOwner = currentUserId && event?.organizerId === currentUserId;
  const isUserCreated = event?.isUserCreated || event?.organizerUser;

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
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="flex justify-between items-center">
              {/* Edit button for event owners */}
              {isEventOwner && (
                <Button
                  onClick={() =>
                    router.push(`/organizer/events/${event.id}/edit`)
                  }
                  variant="outline"
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {event.category}
              </span>

              {/* User-created vs sourced badges */}
              {isUserCreated ? (
                <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Created by Organizer
                </span>
              ) : (
                event.sourceName && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(
                      event.sourceId
                    )}`}
                  >
                    {event.sourceName}
                    {event.isVerified && (
                      <Shield className="inline h-3 w-3 ml-1" />
                    )}
                  </span>
                )
              )}

              {event.status && event.status !== "PUBLISHED" && (
                <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {event.status}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>

            {/* Enhanced organizer info */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="text-xl text-gray-200">
                by{" "}
                {event.organizerUser
                  ? `${
                      event.organizerUser.firstName &&
                      event.organizerUser.lastName
                        ? `${event.organizerUser.firstName} ${event.organizerUser.lastName}`
                        : event.organizerUser.username
                    }`
                  : event.organizer}
              </span>
              {isUserCreated && (
                <span className="bg-purple-500/80 px-2 py-1 rounded text-sm">
                  Organizer
                </span>
              )}
            </div>
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
                  {event.detailedDescription || event.description}
                </p>

                {/* Organizer Details for User-Created Events */}
                {event.organizerUser && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                      <Crown className="h-5 w-5 mr-2" />
                      Event Organizer
                    </h3>
                    <div className="text-purple-800">
                      <p className="font-medium">
                        {event.organizerUser.firstName &&
                        event.organizerUser.lastName
                          ? `${event.organizerUser.firstName} ${event.organizerUser.lastName}`
                          : event.organizerUser.username}
                      </p>
                      <p className="text-sm">@{event.organizerUser.username}</p>
                      {isEventOwner && (
                        <p className="text-xs mt-1 text-purple-600">
                          This is your event
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Source Information for Aggregated Events */}
                {!isUserCreated && event.sourceUrl && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Original Source
                        </p>
                        <p className="text-sm text-gray-600">
                          View more details on {event.sourceName}
                        </p>
                      </div>
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Source
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags && event.tags.length > 0 ? (
                    event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No tags available
                    </span>
                  )}
                </div>
              </div>

              {/* Event Quality Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Event Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Verification:</span>
                    <div className="flex items-center mt-1">
                      {event.isVerified ? (
                        <>
                          <Shield className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">
                            Verified
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Unverified</span>
                      )}
                    </div>
                  </div>

                  {/* Additional info for user-created events */}
                  {isUserCreated && (
                    <>
                      <div>
                        <span className="text-gray-600">Event Type:</span>
                        <div className="flex items-center mt-1">
                          <Crown className="h-4 w-4 text-purple-500 mr-1" />
                          <span className="text-purple-600 font-medium">
                            User Created
                          </span>
                        </div>
                      </div>

                      {event.maxAttendees && (
                        <div>
                          <span className="text-gray-600">Max Attendees:</span>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="font-medium">
                              {event.maxAttendees}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
                  {/* Only show booking for published events or if user is owner */}
                  {(event.status === "PUBLISHED" || isEventOwner) &&
                    (checkingBooking ? (
                      <Button disabled className="w-full" size="lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Checking...
                      </Button>
                    ) : hasBooked ? (
                      <div className="space-y-2">
                        <Button
                          disabled
                          className="w-full bg-green-600"
                          size="lg"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Already Booked
                        </Button>

                        {/* Cancel booking button */}
                        <Button
                          onClick={handleCancelBooking}
                          variant="outline"
                          className="w-full border-red-300 text-red-700 hover:bg-red-50"
                          size="lg"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleBookNow}
                        className="w-full"
                        size="lg"
                      >
                        <IndianRupee className="h-4 w-4 mr-2" />
                        {isEventOwner ? "Preview Booking" : "Book Now"}
                      </Button>
                    ))}

                  {hasBooked && (
                    <Button
                      onClick={() => router.push("/my-bookings")}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      View My Bookings
                    </Button>
                  )}

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
                {/* Event Source/Creator Info */}
                {isUserCreated ? (
                  <div className="mt-4 p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-purple-700">
                          Created by {event.organizerUser?.username}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          User-generated event
                        </p>
                      </div>
                      <Crown className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                ) : (
                  event.sourceName && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            Sourced from {event.sourceName}
                          </p>
                        </div>
                        {event.isVerified && (
                          <Shield className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Map Preview (if coordinates available) */}
              {event.latitude && event.longitude && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Location Preview
                  </h3>
                  <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{event.venueName}</p>
                      <p className="text-xs text-gray-500">{event.city}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleGetDirections}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Event Meta */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Event Details
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="capitalize font-medium">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{isUserCreated ? "User Created" : "Aggregated"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Organizer:</span>
                    <span>
                      {event.organizerUser?.username || event.organizer}
                    </span>
                  </div>

                  {event.status && (
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">
                        {event.status.toLowerCase()}
                      </span>
                    </div>
                  )}

                  {!isUserCreated && event.sourceUrl && (
                    <div className="pt-2 border-t">
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Original Listing
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
