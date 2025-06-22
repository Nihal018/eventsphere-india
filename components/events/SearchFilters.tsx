"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Filter } from "lucide-react";
import { Search, X, ChevronDown } from "lucide-react";
import { FilterOptions } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  cities: string[];
  states: string[];
  categories: string[];
  initialFilters?: FilterOptions;
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

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    (newFilters: FilterOptions) => {
      const timeoutId = setTimeout(() => {
        onFilterChange(newFilters);
      }, 300);
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

  // Custom Select Component - Mobile-friendly version
  const CustomSelect = ({
    value,
    onValueChange,
    placeholder,
    options,
    label,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: string[];
    label: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-3 sm:py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between min-h-[44px] touch-manipulation"
        >
          <span
            className={
              value && value !== "all" ? "text-gray-900" : "text-gray-500"
            }
          >
            {value && value !== "all" ? value : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div
              className="px-3 py-3 sm:py-2 hover:bg-gray-100 cursor-pointer text-gray-700 min-h-[44px] sm:min-h-[auto] flex items-center touch-manipulation"
              onClick={() => {
                onValueChange("all");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </div>
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-3 sm:py-2 hover:bg-gray-100 cursor-pointer text-gray-700 capitalize min-h-[44px] sm:min-h-[auto] flex items-center touch-manipulation"
                onClick={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events by name, description, or tags..."
          value={filters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          className="pl-10 h-12 text-base sm:text-sm"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 min-h-[44px] sm:h-auto touch-manipulation"
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
            className="text-red-600 hover:text-red-700 min-h-[44px] sm:h-auto touch-manipulation"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
          <CustomSelect
            value={filters.city || "all"}
            onValueChange={(value) =>
              handleInputChange("city", value === "all" ? "" : value)
            }
            placeholder="All Cities"
            options={cities}
            label="City"
          />

          <CustomSelect
            value={filters.state || "all"}
            onValueChange={(value) =>
              handleInputChange("state", value === "all" ? "" : value)
            }
            placeholder="All States"
            options={states}
            label="State"
          />

          <CustomSelect
            value={filters.category || "all"}
            onValueChange={(value) =>
              handleInputChange("category", value === "all" ? "" : value)
            }
            placeholder="All Categories"
            options={categories}
            label="Category"
          />

          <CustomSelect
            value={filters.priceRange}
            onValueChange={(value) => handleInputChange("priceRange", value)}
            placeholder="All Events"
            options={["free", "paid"]}
            label="Price"
          />
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-2 sm:py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Category:{" "}
              {filters.category.charAt(0).toUpperCase() +
                filters.category.slice(1)}
              <button
                className="ml-2 text-blue-600 hover:text-blue-800 min-w-[24px] min-h-[24px] flex items-center justify-center touch-manipulation"
                onClick={() => handleInputChange("category", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center px-3 py-2 sm:py-1 rounded-full text-sm bg-green-100 text-green-800">
              City: {filters.city}
              <button
                className="ml-2 text-green-600 hover:text-green-800 min-w-[24px] min-h-[24px] flex items-center justify-center touch-manipulation"
                onClick={() => handleInputChange("city", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.state && (
            <span className="inline-flex items-center px-3 py-2 sm:py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              State: {filters.state}
              <button
                className="ml-2 text-purple-600 hover:text-purple-800 min-w-[24px] min-h-[24px] flex items-center justify-center touch-manipulation"
                onClick={() => handleInputChange("state", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.priceRange !== "all" && (
            <span className="inline-flex items-center px-3 py-2 sm:py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Price:{" "}
              {filters.priceRange === "free" ? "Free Events" : "Paid Events"}
              <button
                className="ml-2 text-orange-600 hover:text-orange-800 min-w-[24px] min-h-[24px] flex items-center justify-center touch-manipulation"
                onClick={() => handleInputChange("priceRange", "all")}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
