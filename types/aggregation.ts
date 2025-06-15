import { EventCategory } from "./index";

export interface RawEventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  address?: string;
  city: string;
  state?: string;
  country?: string;
  price?: number | string;
  isFree?: boolean;
  imageUrl?: string;
  sourceUrl: string;
  organizer?: string;
  category?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

export interface EventSource {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  lastScrapeTime?: string;
  totalEvents?: number;
  successRate?: number;
}

export interface ScrapingResult {
  source: string;
  success: boolean;
  eventsFound: number;
  eventsAdded: number;
  eventsUpdated: number;
  errors: string[];
  timestamp: string;
}

export interface AggregatedEvent {
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

  // Aggregation metadata
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  originalId: string;
  lastUpdated: string;
  isVerified: boolean;
  aggregationScore: number; // Quality score
}

export interface ScrapingConfig {
  enabled: boolean;
  interval: number; // minutes
  sources: string[];
  maxEventsPerSource: number;
  maxPagesPerSource: number;
  rateLimit: number; // requests per second
}
