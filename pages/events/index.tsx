// pages/events/index.tsx
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";

import { Event, FilterOptions } from "@/types";
import { apiRequest } from "@/lib/utils";
import { EventGrid } from "../../components/events/EventGrid";
import { SearchFilters } from "../../components/events/SearchFilters";

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchFilters();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiRequest("/events");
      if (response.success) {
        setEvents(response.data);
        setFilteredEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await apiRequest("/events/search");
      if (response.success) {
        setCities(response.data.cities);
        setStates(response.data.states);
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const handleFilterChange = async (filters: FilterOptions) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.state) queryParams.append("state", filters.state);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.priceRange !== "all")
        queryParams.append("priceRange", filters.priceRange);

      const response = await apiRequest(`/events?${queryParams.toString()}`);
      if (response.success) {
        setFilteredEvents(response.data);
      }
    } catch (error) {
      console.error("Error filtering events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Browse Events - EventSphere India">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Discover Amazing Events
              </h1>
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
    </Layout>
  );
}
