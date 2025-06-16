// lib/useCityContext.ts
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useCityContext = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Priority order: URL param > localStorage > default
    const urlCity = searchParams.get("city");
    const savedCity = localStorage.getItem("selectedCity");

    const initialCity = urlCity || savedCity || "";
    setSelectedCity(initialCity);
  }, [searchParams]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);

    // Update URL if on events page
    if (window.location.pathname === "/events") {
      const url = new URL(window.location.href);
      if (city) {
        url.searchParams.set("city", city);
      } else {
        url.searchParams.delete("city");
      }
      router.push(url.pathname + url.search);
    }
  };

  return { selectedCity, handleCityChange };
};
