// app/events/EventsPageContent.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "@/components/events/SearchFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { Event, FilterOptions } from "@/types";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../../components/layout/Header";

// Constants
const EVENTS_PER_PAGE = 12;
const INITIAL_PAGE = 1;

// Helper function to build query parameters
const buildQueryParams = (
  page: number,
  limit: number,
  filters: FilterOptions
): URLSearchParams => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.search) params.set("search", filters.search);
  if (filters.city) params.set("city", filters.city);
  if (filters.state) params.set("state", filters.state);
  if (filters.category) params.set("category", filters.category);
  if (filters.priceRange !== "all")
    params.set("priceRange", filters.priceRange);

  return params;
};

export default function EventsPageContent() {
  const searchParams = useSearchParams();

  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filter options
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize filters from URL params
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

  // Fetch filter options separately
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch("/api/events/search");
      const data = await response.json();

      if (data.success && data.cities && data.states && data.categories) {
        setCities(data.cities);
        setStates(data.states);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, []);

  // Fetch events with proper pagination and filters
  const fetchEvents = useCallback(
    async (page: number, currentFilters: FilterOptions) => {
      try {
        setError(null);
        setLoading(true);

        const params = buildQueryParams(page, EVENTS_PER_PAGE, currentFilters);
        console.log("Fetching events with params:", params.toString());

        const response = await fetch(`/api/events?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          const newEvents = data.data || [];
          const total = data.total || 0;

          setEvents(newEvents);
          setTotalEvents(total);
          setCurrentPage(page);
        } else {
          throw new Error(data.error || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load events"
        );
        setEvents([]);
        setTotalEvents(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      fetchEvents(page, filters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, fetchEvents]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: FilterOptions) => {
      console.log("Filter changed:", newFilters);
      setFilters(newFilters);
      setCurrentPage(INITIAL_PAGE);
      fetchEvents(INITIAL_PAGE, newFilters);
    },
    [fetchEvents]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    const emptyFilters: FilterOptions = {
      search: "",
      city: "",
      state: "",
      category: "",
      priceRange: "all",
    };
    handleFilterChange(emptyFilters);
  }, [handleFilterChange]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalEvents / EVENTS_PER_PAGE);
  }, [totalEvents]);

  // Generate page numbers for pagination
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Get active filter summary
  const filterSummary = useMemo(() => {
    const activeFilters = [];

    if (filters.search) activeFilters.push(`"${filters.search}"`);
    if (filters.city) activeFilters.push(filters.city);
    if (filters.state) activeFilters.push(filters.state);
    if (filters.category) {
      activeFilters.push(
        filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      );
    }
    if (filters.priceRange !== "all") {
      activeFilters.push(
        filters.priceRange === "free" ? "Free Events" : "Paid Events"
      );
    }

    return activeFilters.length > 0 ? ` for ${activeFilters.join(", ")}` : "";
  }, [filters]);

  // Calculate showing range
  const showingRange = useMemo(() => {
    if (totalEvents === 0) return { start: 0, end: 0 };
    const start = (currentPage - 1) * EVENTS_PER_PAGE + 1;
    const end = Math.min(currentPage * EVENTS_PER_PAGE, totalEvents);
    return { start, end };
  }, [currentPage, totalEvents]);

  // Trigger event scraping
  const triggerScraping = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/admin/scrape-events", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        await fetchEvents(1, filters);
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

  // Initial load
  useEffect(() => {
    fetchEvents(INITIAL_PAGE, filters);
    fetchFilterOptions();
  }, []);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
  }, [getInitialFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 mt-14 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-6 px-4">
              Find the perfect event for you from our live collection across
              India
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
          <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchEvents(currentPage, filters)}
                className="w-full sm:w-auto sm:ml-auto"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {loading ? (
                "Loading Events..."
              ) : (
                <>
                  {totalEvents} Events Found
                  <span className="block sm:inline text-base sm:text-lg font-normal text-gray-600 mt-1 sm:mt-0">
                    {filterSummary}
                  </span>
                </>
              )}
            </h2>
            {!loading && totalEvents > 0 && (
              <p className="text-sm text-gray-600">
                Showing {showingRange.start}-{showingRange.end} of {totalEvents}{" "}
                events
              </p>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            onClick={() => fetchEvents(currentPage, filters)}
            disabled={refreshing || loading}
            variant="outline"
            className="flex items-center space-x-2 w-full sm:w-auto min-h-[44px] sm:h-auto"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing || loading ? "animate-spin" : ""
              }`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh Events"}</span>
          </Button>
        </div>

        {/* No Events State */}
        {!loading && totalEvents === 0 && !error && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🎭</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              {filterSummary
                ? "Try adjusting your search criteria or clear filters to see more events."
                : "No events available at the moment. Please check back later or load events from our sources."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {filterSummary && (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full sm:w-auto min-h-[44px] sm:h-auto"
                >
                  Clear All Filters
                </Button>
              )}
              {!filterSummary && (
                <Button
                  onClick={triggerScraping}
                  disabled={refreshing}
                  size="lg"
                  className="px-6 sm:px-8 w-full sm:w-auto min-h-[48px]"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Loading Events..." : "Load Events Now"}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Event Grid */}
        <EventGrid events={events} loading={loading} />

        {/* Pagination Controls */}
        {!loading && totalEvents > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-8">
            {/* Previous Button */}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="px-3 py-2 flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers.map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      onClick={() => handlePageChange(page as number)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`px-3 py-2 min-w-[40px] ${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="px-3 py-2 flex items-center"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Page Info for Mobile */}
        {!loading && totalEvents > 0 && totalPages > 1 && (
          <div className="text-center text-sm text-gray-600 pb-4 sm:hidden">
            Page {currentPage} of {totalPages}
          </div>
        )}

        {/* Source Attribution */}
        {!loading && totalEvents > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Events sourced from trusted platforms across India
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs">
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                🎫 Ticketmaster
              </span>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full">
                📊 PredictHQ
              </span>
              <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                🌐 AllEvents.in
              </span>
              <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                🔍 Google Events
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
