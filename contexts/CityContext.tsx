// contexts/CityContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the context value
interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}
interface CityProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const CityContext = createContext<CityContextType>({
  selectedCity: "",
  setSelectedCity: () => {},
});

// Create a provider component

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  // State for selected city, managed within the context provider
  const [selectedCity, setSelectedCity] = useState<string>("");
  // Effect to load city from localStorage on initial mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      // Set a default city if nothing is saved
      setSelectedCity("Bengaluru"); // Or any other default
    }
  }, []);

  // Provide the state and setter to children components
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {/* Corrected line */}
      {children}
    </CityContext.Provider>
  );
};

// Custom hook to consume the context
export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
