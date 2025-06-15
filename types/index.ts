export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  imageUrl?: string;
  price: number;
  isFree: boolean;
  category: string;
  organizer: string;
  sourceId?: string;
  sourceName?: string;
  tags: string[];
  detailedDescription?: string;
}

export interface ScrapingStatus {
  totalEventsInDatabase: number;
  lastRun: string | null;
  eventsBySource?: Array<{ source: string; count: number }>;
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Component prop types
export interface EventCardProps {
  event: Event;
}

export interface SearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  cities: string[];
  states: string[];
  categories: string[];
  initialFilters?: FilterOptions; // Add optional initial filters
}

export interface EventGridProps {
  events: Event[];
  loading?: boolean;
}

export interface FeaturedEventsProps {
  events: Event[];
}

// Layout prop types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// Auth form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Booking form types
export interface BillingInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface CheckoutFormData extends BillingInfo {
  paymentMethod: "card" | "upi" | "netbanking";
}

// Confirmation details type
export interface ConfirmationDetails extends BookingDetails, BillingInfo {
  paymentMethod: string;
  confirmationId: string;
  paymentStatus: string;
  bookedAt: string;
}
