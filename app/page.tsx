"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  Users,
  RefreshCw,
} from "lucide-react";

import { Event, ScrapingStatus } from "@/types";
import { useCity } from "../contexts/CityContext";

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { selectedCity, setSelectedCity } = useCity();

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "/api/events?limit=3&" + new URLSearchParams({ city: selectedCity })
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setFeaturedEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchScrapingStatus = async () => {
    try {
      const response = await fetch("/api/admin/scrape-events");
      const data = await response.json();

      if (data.success) {
        setScrapingStatus(data.status);
      }
    } catch (error) {
      console.error("Error fetching scraping status:", error);
    }
  };

  const triggerScraping = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/admin/scrape-events", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        await fetchEvents();
        await fetchScrapingStatus();
      }
    } catch (error) {
      console.error("Error triggering scraping:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchScrapingStatus()]);
      setLoading(false);
    };

    loadData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - Mobile Optimized */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center pt-16 sm:pt-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32 w-full">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fadeIn leading-tight">
                Discover Amazing Events
                <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mt-2">
                  Across India
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto animate-fadeIn px-4">
                From concerts to conferences, festivals to workshops - find your
                next great experience
              </p>

              {/* Enhanced stats bar - Mobile Responsive */}
              {scrapingStatus && (
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg max-w-full sm:max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
                    <span className="text-blue-200 text-center">
                      📅 <strong>{scrapingStatus.totalEventsInDatabase}</strong>{" "}
                      live events
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                      {scrapingStatus.eventsBySource
                        ?.slice(0, 2)
                        .map((source, index) => (
                          <span
                            key={index}
                            className="text-blue-200 text-xs sm:text-sm"
                          >
                            {source.source}: <strong>{source.count}</strong>
                          </span>
                        ))}
                    </div>
                  </div>
                  {scrapingStatus.lastRun && (
                    <p className="text-xs text-blue-300 mt-2 text-center">
                      Last updated:{" "}
                      {new Date(scrapingStatus.lastRun).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fadeIn px-4">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-900 hover:opacity-90 bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                  >
                    <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Explore Events
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-purple-900 hover:opacity-90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                  onClick={triggerScraping}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Scrape New Events"}
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Elements - Hidden on mobile for cleaner look */}
          <div className="hidden sm:block absolute top-20 left-10 opacity-20">
            <Calendar className="h-20 w-20 text-yellow-400 animate-pulse" />
          </div>
          <div className="hidden sm:block absolute bottom-20 right-10 opacity-20">
            <MapPin className="h-16 w-16 text-blue-400 animate-pulse" />
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why Choose EventSphere?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                We aggregate events from multiple sources to bring you the best
                experiences across India
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  Real-Time Discovery
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Events from Ticketmaster, AllEvents.in, PredictHQ and more -
                  all in one place with live updates
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  Seamless Booking
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Book your tickets instantly with our secure and user-friendly
                  booking system
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  Verified Sources
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  All events are sourced from trusted platforms and verified
                  organizers across India
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events - Mobile Responsive */}
        {loading ? (
          <section className="py-12 sm:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Loading Events...
                </h2>
                <div className="animate-pulse space-y-4 mb-6 sm:mb-8">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-48 sm:h-64 bg-gray-300 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={fetchEvents}
                  disabled={loading}
                  size="lg"
                  variant="outline"
                  className="px-6 sm:px-8"
                >
                  <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Try Again
                </Button>
              </div>
            </div>
          </section>
        ) : featuredEvents.length > 0 ? (
          <FeaturedEvents events={featuredEvents} />
        ) : (
          <section className="py-12 sm:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                No Events Yet
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
                No events found in database. Try refreshing or load from
                sources.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={triggerScraping}
                  disabled={isRefreshing}
                  size="lg"
                  className="px-6 sm:px-8 w-full sm:w-auto"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Loading Events..." : "Load from Sources"}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section - Mobile Grid Optimized */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Popular Categories
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                Explore events by category and find exactly what you're looking
                for
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  name: "Music",
                  icon: "🎵",
                  color: "bg-red-100 text-red-800",
                  link: "/events?category=music",
                },
                {
                  name: "Technology",
                  icon: "💻",
                  color: "bg-blue-100 text-blue-800",
                  link: "/events?category=technology",
                },
                {
                  name: "Food",
                  icon: "🍕",
                  color: "bg-yellow-100 text-yellow-800",
                  link: "/events?category=food",
                },
                {
                  name: "Arts",
                  icon: "🎨",
                  color: "bg-purple-100 text-purple-800",
                  link: "/events?category=arts",
                },
                {
                  name: "Sports",
                  icon: "⚽",
                  color: "bg-green-100 text-green-800",
                  link: "/events?category=sports",
                },
                {
                  name: "Comedy",
                  icon: "😂",
                  color: "bg-pink-100 text-pink-800",
                  link: "/events?category=comedy",
                },
                {
                  name: "Business",
                  icon: "💼",
                  color: "bg-gray-100 text-gray-800",
                  link: "/events?category=business",
                },
                {
                  name: "Wellness",
                  icon: "🧘",
                  color: "bg-teal-100 text-teal-800",
                  link: "/events?category=wellness",
                },
              ].map((category) => (
                <Link key={category.name} href={category.link}>
                  <div className="text-center p-3 sm:p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer group bg-white">
                    <div
                      className={`${category.color} w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 text-lg sm:text-2xl group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Ready to Discover Your Next Event?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
              {scrapingStatus?.totalEventsInDatabase
                ? `Join thousands exploring our ${scrapingStatus.totalEventsInDatabase}+ live events`
                : "Join thousands of event-goers who trust EventSphere for their entertainment needs"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                >
                  Browse All Events
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
