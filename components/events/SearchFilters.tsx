"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SlidersHorizontal as Filter } from "lucide-react";
import { Search, X } from "lucide-react";
import { FilterOptions } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  cities: string[];
  states: string[];
  categories: string[];
  initialFilters?: FilterOptions; // Add initial filters prop
}

export default function SearchFilters({
  onFilterChange,
  cities,
  states,
  categories,
  initialFilters,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || {
      search: "",
      city: "",
      state: "",
      category: "",
      priceRange: "all",
    }
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update local state when initial filters change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
      // Auto-open filters if any are active from URL
      const hasActiveFilters =
        initialFilters.search ||
        initialFilters.city ||
        initialFilters.state ||
        initialFilters.category ||
        initialFilters.priceRange !== "all";
      if (hasActiveFilters) {
        setIsFilterOpen(true);
      }
    }
  }, [initialFilters]);

  // Debounced filter change to avoid too many calls
  const debouncedFilterChange = useCallback(
    (newFilters: FilterOptions) => {
      const timeoutId = setTimeout(() => {
        onFilterChange(newFilters);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    },
    [onFilterChange]
  );

  useEffect(() => {
    const cleanup = debouncedFilterChange(filters);
    return cleanup;
  }, [filters, debouncedFilterChange]);

  const handleInputChange = useCallback(
    (field: keyof FilterOptions, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      city: "",
      state: "",
      category: "",
      priceRange: "all",
    });
  }, []);

  const hasActiveFilters =
    filters.search ||
    filters.city ||
    filters.state ||
    filters.category ||
    filters.priceRange !== "all";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events by name, description, or tags..."
          value={filters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Select
              value={filters.city || "all"}
              onValueChange={(value) =>
                handleInputChange("city", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <Select
              value={filters.state || "all"}
              onValueChange={(value) =>
                handleInputChange("state", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleInputChange("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) => handleInputChange("priceRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="free">Free Events</SelectItem>
                <SelectItem value="paid">Paid Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Category:{" "}
              {filters.category.charAt(0).toUpperCase() +
                filters.category.slice(1)}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleInputChange("category", "")}
              />
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              City: {filters.city}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleInputChange("city", "")}
              />
            </span>
          )}
          {filters.state && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              State: {filters.state}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleInputChange("state", "")}
              />
            </span>
          )}
          {filters.priceRange !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Price:{" "}
              {filters.priceRange === "free" ? "Free Events" : "Paid Events"}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleInputChange("priceRange", "all")}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
