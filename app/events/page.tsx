"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities] = useState<string[]>(getUniqueCities());
  const [states] = useState<string[]>(getUniqueStates());
  const [categories] = useState<string[]>(getUniqueCategories());

  // Get initial filters from URL parameters
  const getInitialFilters = useCallback((): FilterOptions => {
    return {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      category: (searchParams.get("category") as any) || "",
      priceRange: (searchParams.get("priceRange") as any) || "all",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters());

  useEffect(() => {
    // Update filters when URL changes
    setFilters(getInitialFilters());
  }, [getInitialFilters]);

  useEffect(() => {
    // Simulate API call
    const loadEvents = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents(mockEvents);
      setLoading(false);
    };

    loadEvents();
  }, []); // Empty dependency array - only run once

  // Apply filters function
  const applyFilters = useCallback(
    (filterOptions: FilterOptions) => {
      let filtered = [...events];

      // Filter by search term
      if (filterOptions.search) {
        const searchTerm = filterOptions.search.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by city (only if not empty string)
      if (filterOptions.city && filterOptions.city !== "") {
        filtered = filtered.filter(
          (event) =>
            event.city.toLowerCase() === filterOptions.city.toLowerCase()
        );
      }

      // Filter by state (only if not empty string)
      if (filterOptions.state && filterOptions.state !== "") {
        filtered = filtered.filter(
          (event) =>
            event.state.toLowerCase() === filterOptions.state.toLowerCase()
        );
      }

      // Filter by category (only if not empty string)
      if (filterOptions.category) {
        filtered = filtered.filter(
          (event) => event.category === filterOptions.category
        );
      }

      // Filter by price range
      if (filterOptions.priceRange === "free") {
        filtered = filtered.filter((event) => event.isFree);
      } else if (filterOptions.priceRange === "paid") {
        filtered = filtered.filter((event) => !event.isFree);
      }

      // Sort by date (upcoming events first)
      filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setFilteredEvents(filtered);
    },
    [events]
  );

  // Apply filters whenever events or filters change
  useEffect(() => {
    if (events.length > 0) {
      applyFilters(filters);
    }
  }, [events, filters, applyFilters]);

  // Handle filter changes from the SearchFilters component
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // Get the active filter summary for display
  const getFilterSummary = () => {
    const activeFilters = [];

    if (filters.search) activeFilters.push(`"${filters.search}"`);
    if (filters.city) activeFilters.push(filters.city);
    if (filters.state) activeFilters.push(filters.state);
    if (filters.category)
      activeFilters.push(
        filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      );
    if (filters.priceRange !== "all")
      activeFilters.push(
        filters.priceRange === "free" ? "Free Events" : "Paid Events"
      );

    if (activeFilters.length > 0) {
      return ` for ${activeFilters.join(", ")}`;
    }
    return "";
  };

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
          initialFilters={filters} // Pass initial filters to component
        />

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? "Loading..." : `${filteredEvents.length} Events Found`}
            {!loading && (
              <span className="text-lg font-normal text-gray-600">
                {getFilterSummary()}
              </span>
            )}
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
