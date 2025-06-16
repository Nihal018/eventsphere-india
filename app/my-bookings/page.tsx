"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  X,
  Navigation,
  ExternalLink,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Header from "../../components/layout/Header";

interface Booking {
  id: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venueName: string;
    venueAddress: string;
    city: string;
    state: string;
    price: number;
    isFree: boolean;
    imageUrl?: string;
    category: string;
    organizer: string;
    latitude?: number;
    longitude?: number;
  };
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled">(
    "all"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      setError("An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Booking cancelled successfully");
        fetchBookings();
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      alert("An error occurred while cancelling booking");
    }
  };

  const getDirections = (booking: Booking) => {
    const { latitude, longitude, venueAddress, city } = booking.event;

    if (latitude && longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          venueAddress + ", " + city
        )}`,
        "_blank"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter;
  });

  const upcomingBookings = filteredBookings.filter(
    (b) => new Date(b.event.date) >= new Date() && b.status === "CONFIRMED"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your event bookings and view upcoming events
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "CANCELLED").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: "all", label: "All Bookings" },
                { key: "confirmed", label: "Confirmed" },
                { key: "cancelled", label: "Cancelled" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "You haven't booked any events yet."
                : `No ${filter} bookings found.`}
            </p>
            <div className="mt-6">
              <Link href="/events">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Browse Events
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="flex-shrink-0 h-20 w-20 relative">
                        <Image
                          src={
                            booking.event.imageUrl || "/placeholder-event.jpg"
                          }
                          alt={booking.event.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/events/${booking.event.id}`}
                            className="text-lg font-bold text-gray-900 hover:text-blue-600"
                          >
                            {booking.event.title}
                          </Link>

                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">
                                {booking.status.toLowerCase()}
                              </span>
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {booking.event.description}
                        </p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{formatDate(booking.event.date)}</span>
                          </div>

                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{formatTime(booking.event.time)}</span>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                            <span>
                              {booking.event.venueName}, {booking.event.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                      {!booking.event.isFree && (
                        <span className="ml-3 font-medium">
                          ₹{booking.event.price}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => getDirections(booking)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </button>

                      <Link href={`/events/${booking.event.id}`}>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Event
                        </button>
                      </Link>

                      {booking.status === "CONFIRMED" &&
                        new Date(booking.event.date) > new Date() && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
