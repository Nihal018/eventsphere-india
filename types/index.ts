export interface Event {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  imageUrl: string;
  price: number;
  isFree: boolean;
  latitude: number;
  longitude: number;
  category: EventCategory;
  organizer: string;
  tags: string[];
}

export type EventCategory =
  | "music"
  | "technology"
  | "business"
  | "arts"
  | "sports"
  | "food"
  | "comedy"
  | "education"
  | "wellness";

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, "password">;
  message?: string;
}

export interface BookingDetails {
  eventId: string;
  eventTitle: string;
  price: number;
  date: string;
  time: string;
  venueName: string;
}

export interface FilterOptions {
  search: string;
  city: string;
  state: string;
  category: EventCategory | "";
  priceRange: "free" | "paid" | "all";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
