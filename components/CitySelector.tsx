import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";

interface City {
  name: string;
  state: string;
  isMetro: boolean;
}

const INDIAN_CITIES: City[] = [
  // Metro Cities
  { name: "Mumbai", state: "Maharashtra", isMetro: true },
  { name: "Delhi", state: "Delhi", isMetro: true },
  { name: "Bengaluru", state: "Karnataka", isMetro: true },
  //   { name: "Hyderabad", state: "Telangana", isMetro: true },
  //   { name: "Chennai", state: "Tamil Nadu", isMetro: true },
  //   { name: "Kolkata", state: "West Bengal", isMetro: true },
  //   { name: "Pune", state: "Maharashtra", isMetro: true },
  //   { name: "Ahmedabad", state: "Gujarat", isMetro: true },

  //
  //   { name: "Jaipur", state: "Rajasthan", isMetro: false },
  //   { name: "Surat", state: "Gujarat", isMetro: false },
  //   { name: "Lucknow", state: "Uttar Pradesh", isMetro: false },
  //   { name: "Kanpur", state: "Uttar Pradesh", isMetro: false },
  //   { name: "Nagpur", state: "Maharashtra", isMetro: false },
  //   { name: "Indore", state: "Madhya Pradesh", isMetro: false },
  //   { name: "Thane", state: "Maharashtra", isMetro: false },
  //   { name: "Bhopal", state: "Madhya Pradesh", isMetro: false },
  //   { name: "Visakhapatnam", state: "Andhra Pradesh", isMetro: false },
  //   { name: "Pimpri-Chinchwad", state: "Maharashtra", isMetro: false },
  //   { name: "Patna", state: "Bihar", isMetro: false },
  //   { name: "Vadodara", state: "Gujarat", isMetro: false },
  //   { name: "Ghaziabad", state: "Uttar Pradesh", isMetro: false },
  //   { name: "Ludhiana", state: "Punjab", isMetro: false },
  //   { name: "Agra", state: "Uttar Pradesh", isMetro: false },
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = INDIAN_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metroCities = filteredCities.filter((city) => city.isMetro);
  const otherCities = filteredCities.filter((city) => !city.isMetro);

  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      {/* City Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <MapPin className="h-4 w-4" />
        <span>{selectedCity || "Select City"}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Your City
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search for your city"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Cities List */}
            <div className="overflow-y-auto max-h-96">
              {/* Metro Cities */}
              {metroCities.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                    Metro Cities
                  </div>
                  {metroCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Other Cities */}
              {otherCities.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                    Other Cities
                  </div>
                  {otherCities.slice(0, 20).map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredCities.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No cities found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CitySelector;
