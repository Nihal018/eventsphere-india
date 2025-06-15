"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "@/components/events/SearchFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { Event, FilterOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic filter options from real data
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await fetch("/api/events");
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);

        // Extract unique values for filters
        const uniqueCities = [
          ...new Set(data.data.map((event: Event) => event.city)),
        ].sort();
        const uniqueStates = [
          ...new Set(data.data.map((event: Event) => event.state)),
        ].sort();
        const uniqueCategories = [
          ...new Set(data.data.map((event: Event) => event.category)),
        ].sort();

        setCities(uniqueCities);
        setStates(uniqueStates);
        setCategories(uniqueCategories);
      } else {
        setError(data.error || "Failed to fetch events");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again.");
      setEvents([]);
    }
  };

  // Trigger event scraping
  const triggerScraping = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/admin/scrape-events", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // Refresh events after scraping
        await fetchEvents();
      } else {
        setError("Failed to refresh events. Please try again.");
      }
    } catch (error) {
      console.error("Error triggering scraping:", error);
      setError("Failed to refresh events. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Update filters when URL changes
    setFilters(getInitialFilters());
  }, [getInitialFilters]);

  useEffect(() => {
    // Load events on component mount
    const loadEvents = async () => {
      setLoading(true);
      await fetchEvents();
      setLoading(false);
    };

    loadEvents();
  }, []);

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
            event.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
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
    } else {
      setFilteredEvents([]);
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
            <p className="text-xl text-blue-100 mb-6">
              Find the perfect event for you from our live collection across
              India
            </p>

            {/* Live Stats */}
            <div className="flex justify-center items-center space-x-6 text-sm bg-white/10 backdrop-blur-sm rounded-lg py-3 px-6 max-w-2xl mx-auto">
              <span className="text-blue-200">
                📅 <strong>{events.length}</strong> live events
              </span>
              <span className="text-blue-200">
                🏙️ <strong>{cities.length}</strong> cities
              </span>
              <span className="text-blue-200">
                🎭 <strong>{categories.length}</strong> categories
              </span>
            </div>
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
          initialFilters={filters}
        />

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {loading ? "Loading..." : `${filteredEvents.length} Events Found`}
              {!loading && (
                <span className="text-lg font-normal text-gray-600">
                  {getFilterSummary()}
                </span>
              )}
            </h2>
            <p className="text-gray-600">
              Live events from Ticketmaster, AllEvents.in, PredictHQ and more
            </p>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={triggerScraping}
            disabled={refreshing || loading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh Events"}</span>
          </Button>
        </div>

        {/* No Events State */}
        {!loading && events.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Available
            </h3>
            <p className="text-gray-600 mb-6">
              It looks like there are no events in the database yet. Click
              "Refresh Events" to load the latest events from our sources.
            </p>
            <Button
              onClick={triggerScraping}
              disabled={refreshing}
              size="lg"
              className="px-8"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Loading Events..." : "Load Events Now"}
            </Button>
          </div>
        )}

        {/* No Filtered Results State */}
        {!loading && events.length > 0 && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Match Your Filters
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or clear some filters to see
              more events.
            </p>
            <Button
              onClick={() =>
                setFilters({
                  search: "",
                  city: "",
                  state: "",
                  category: "",
                  priceRange: "all",
                })
              }
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Event Grid */}
        <EventGrid events={filteredEvents} loading={loading} />

        {/* Source Attribution */}
        {!loading && events.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Events sourced from trusted platforms across India
            </p>
            <div className="flex justify-center items-center space-x-6 text-xs">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                🎫 Ticketmaster
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                📊 PredictHQ
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                🌐 AllEvents.in
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                🔍 Google Events
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
