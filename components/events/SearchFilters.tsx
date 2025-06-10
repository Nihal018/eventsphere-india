// components/events/SearchFilters.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { FilterOptions } from "@/types";
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface SearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  cities: string[];
  states: string[];
  categories: string[];
}

export function SearchFilters({
  onFilterChange,
  cities,
  states,
  categories,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    city: "",
    state: "",
    category: "",
    priceRange: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      state: "",
      category: "",
      priceRange: "all",
    });
  };

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
            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
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
              value={filters.city}
              onValueChange={(value) => handleInputChange("city", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
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
              value={filters.state}
              onValueChange={(value) => handleInputChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
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
              value={filters.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
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
    </div>
  );
}
