import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fixed date formatting to ensure SSR/client consistency
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);

    // Use a more explicit formatting approach to avoid locale differences
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Force UTC to avoid timezone differences
    };

    // Use 'en-US' to ensure consistent formatting across server/client
    return dateObj.toLocaleDateString("en-US", options);
  } catch (error) {
    return date;
  }
}

// Alternative: Simple manual formatting to avoid locale issues entirely
export function formatDateSimple(date: string): string {
  try {
    const dateObj = new Date(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayName = days[dateObj.getDay()];
    const monthName = months[dateObj.getMonth()];
    const dayNumber = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${dayName}, ${dayNumber} ${monthName} ${year}`;
  } catch (error) {
    return date;
  }
}

// Format time for display
export function formatTime(time: string): string {
  try {
    // Use a consistent approach for time formatting
    const timeObj = new Date(`2000-01-01T${time}`);
    return timeObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return time;
  }
}

// Format price
export function formatPrice(price: number): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("$", "₹");
  } catch (error) {
    return `₹${price}`;
  }
}

// Enhanced function to get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location access denied by user"));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable"));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;
          default:
            reject(
              new Error("An unknown error occurred while retrieving location")
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Enhanced Google Maps URL generation with optional current location
export function generateMapsUrl(
  destinationLat: number,
  destinationLng: number,
  destinationAddress?: string,
  originLat?: number,
  originLng?: number
): string {
  const baseUrl = "https://www.google.com/maps/dir/";

  // If we have origin coordinates, use them
  if (originLat && originLng) {
    return `${baseUrl}${originLat},${originLng}/${destinationLat},${destinationLng}`;
  }

  // If we have destination address, use it
  if (destinationAddress) {
    return `${baseUrl}/${encodeURIComponent(destinationAddress)}`;
  }

  // Fallback to just destination coordinates
  return `${baseUrl}/${destinationLat},${destinationLng}`;
}

// Enhanced directions function with location permission
export const getDirectionsWithLocation = async (
  destinationLat: number,
  destinationLng: number,
  destinationAddress?: string
): Promise<void> => {
  try {
    // Try to get user's current location
    const position = await getCurrentLocation();
    const { latitude: originLat, longitude: originLng } = position.coords;

    // Generate URL with user's current location as origin
    const mapsUrl = generateMapsUrl(
      destinationLat,
      destinationLng,
      destinationAddress,
      originLat,
      originLng
    );

    // Open in new tab/window
    window.open(mapsUrl, "_blank");
  } catch (error) {
    console.warn("Could not get current location:", error);

    // Fallback to original behavior (no origin location)
    const mapsUrl = generateMapsUrl(
      destinationLat,
      destinationLng,
      destinationAddress
    );
    window.open(mapsUrl, "_blank");
  }
};

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth-token");
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
}

// Set auth token
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth-token", token);
}

// Remove auth token
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth-token");
}

// API request helper
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
