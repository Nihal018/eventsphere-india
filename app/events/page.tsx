"use client";

import { useState, useEffect, useCallback } from "react";
import SearchFilters from "@/components/events/SearchFilters";

import { Event, FilterOptions } from "@/types";
import {
  mockEvents,
  getUniqueCities,
  getUniqueStates,
  getUniqueCategories,
} from "@/lib/data";
import { EventGrid } from "../../components/events/EventGrid";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities] = useState<string[]>(getUniqueCities());
  const [states] = useState<string[]>(getUniqueStates());
  const [categories] = useState<string[]>(getUniqueCategories());

  useEffect(() => {
    // Simulate API call
    const loadEvents = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    };

    loadEvents();
  }, []); // Empty dependency array - only run once

  // Use useCallback to memoize the filter function
  const handleFilterChange = useCallback(
    (filters: FilterOptions) => {
      let filtered = [...events];

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by city (only if not empty string)
      if (filters.city && filters.city !== "") {
        filtered = filtered.filter(
          (event) => event.city.toLowerCase() === filters.city.toLowerCase()
        );
      }

      // Filter by state (only if not empty string)
      if (filters.state && filters.state !== "") {
        filtered = filtered.filter(
          (event) => event.state.toLowerCase() === filters.state.toLowerCase()
        );
      }

      // Filter by category (only if defined)
      if (filters.category) {
        filtered = filtered.filter(
          (event) => event.category === filters.category
        );
      }

      // Filter by price range
      if (filters.priceRange === "free") {
        filtered = filtered.filter((event) => event.isFree);
      } else if (filters.priceRange === "paid") {
        filtered = filtered.filter((event) => !event.isFree);
      }

      // Sort by date (upcoming events first)
      filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setFilteredEvents(filtered);
    },
    [events]
  ); // Only recreate when events change

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Events</h1>
            <p className="text-xl text-blue-100">
              Find the perfect event for you from our curated collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchFilters
          onFilterChange={handleFilterChange}
          cities={cities}
          states={states}
          categories={categories}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? "Loading..." : `${filteredEvents.length} Events Found`}
          </h2>
          <p className="text-gray-600">
            Discover amazing events happening across India
          </p>
        </div>

        {/* Event Grid */}
        <EventGrid events={filteredEvents} loading={loading} />
      </div>
    </div>
  );
}
