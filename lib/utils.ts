import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return date;
  }
}

// Format time for display
export function formatTime(time: string): string {
  try {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
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
