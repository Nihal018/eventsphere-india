import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format time for display
export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}

// Generate Google Maps URL
export function generateMapsUrl(
  lat: number,
  lng: number,
  destination?: string
): string {
  const baseUrl = "https://www.google.com/maps/dir/";
  if (destination) {
    return `${baseUrl}${encodeURIComponent(destination)}/${lat},${lng}`;
  }
  return `${baseUrl}/${lat},${lng}`;
}

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
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
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
