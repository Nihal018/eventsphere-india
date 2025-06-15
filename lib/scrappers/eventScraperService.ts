import {
  RawEventData,
  ScrapingResult,
  AggregatedEvent,
  EventSource,
} from "@/types/aggregation";
import { EventCategory } from "@/types";

export class EventScraperService {
  private sources: EventSource[] = [
    {
      id: "eventbrite",
      name: "Eventbrite",
      baseUrl: "https://www.eventbrite.com",
      enabled: true,
    },
    {
      id: "meetup",
      name: "Meetup",
      baseUrl: "https://www.meetup.com",
      enabled: true,
    },
    {
      id: "bookmyshow",
      name: "BookMyShow",
      baseUrl: "https://in.bookmyshow.com",
      enabled: true,
    },
  ];

  private readonly RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
  private readonly MAX_RETRIES = 3;

  async scrapeAllSources(): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];

    for (const source of this.sources.filter((s) => s.enabled)) {
      try {
        console.log(`Starting scrape for ${source.name}...`);
        const result = await this.scrapeSource(source);
        results.push(result);

        // Rate limiting between sources
        await this.delay(this.RATE_LIMIT_DELAY);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        results.push({
          source: source.name,
          success: false,
          eventsFound: 0,
          eventsAdded: 0,
          eventsUpdated: 0,
          errors: [error instanceof Error ? error.message : "Unknown error"],
          timestamp: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  private async scrapeSource(source: EventSource): Promise<ScrapingResult> {
    const startTime = Date.now();

    try {
      let rawEvents: RawEventData[] = [];

      // Route to appropriate scraper based on source
      switch (source.id) {
        case "eventbrite":
          rawEvents = await this.scrapeEventbrite();
          break;
        case "meetup":
          rawEvents = await this.scrapeMeetup();
          break;
        case "bookmyshow":
          rawEvents = await this.scrapeBookMyShow();
          break;
        default:
          throw new Error(`Unknown source: ${source.id}`);
      }

      // Process and clean the data
      const processedEvents = await this.processRawEvents(rawEvents, source);

      // Save to database (this would integrate with your data layer)
      const { added, updated } = await this.saveEvents(processedEvents);

      return {
        source: source.name,
        success: true,
        eventsFound: rawEvents.length,
        eventsAdded: added,
        eventsUpdated: updated,
        errors: [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        source: source.name,
        success: false,
        eventsFound: 0,
        eventsAdded: 0,
        eventsUpdated: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async scrapeEventbrite(): Promise<RawEventData[]> {
    // For MVP, we'll use Eventbrite's public API
    const cities = ["mumbai", "delhi", "bangalore"];
    const events: RawEventData[] = [];

    for (const city of cities) {
      try {
        // This would use Eventbrite's API
        // For now, returning mock data structure
        const mockEvents = await this.getMockEventbriteEvents(city);
        events.push(...mockEvents);

        await this.delay(this.RATE_LIMIT_DELAY);
      } catch (error) {
        console.error(`Error scraping Eventbrite for ${city}:`, error);
      }
    }

    return events;
  }

  private async scrapeMeetup(): Promise<RawEventData[]> {
    // Meetup API integration
    const cities = ["mumbai", "delhi", "bangalore"];
    const events: RawEventData[] = [];

    for (const city of cities) {
      try {
        const mockEvents = await this.getMockMeetupEvents(city);
        events.push(...mockEvents);

        await this.delay(this.RATE_LIMIT_DELAY);
      } catch (error) {
        console.error(`Error scraping Meetup for ${city}:`, error);
      }
    }

    return events;
  }

  private async scrapeBookMyShow(): Promise<RawEventData[]> {
    // BookMyShow would require careful scraping due to no public API
    const cities = ["mumbai", "delhi", "bangalore"];
    const events: RawEventData[] = [];

    for (const city of cities) {
      try {
        const mockEvents = await this.getMockBookMyShowEvents(city);
        events.push(...mockEvents);

        await this.delay(this.RATE_LIMIT_DELAY);
      } catch (error) {
        console.error(`Error scraping BookMyShow for ${city}:`, error);
      }
    }

    return events;
  }

  private async processRawEvents(
    rawEvents: RawEventData[],
    source: EventSource
  ): Promise<AggregatedEvent[]> {
    return rawEvents.map((raw) => this.transformToAggregatedEvent(raw, source));
  }

  private transformToAggregatedEvent(
    raw: RawEventData,
    source: EventSource
  ): AggregatedEvent {
    return {
      id: `${source.id}_${raw.id}`,
      title: raw.title || "Untitled Event",
      description: raw.description || "",
      detailedDescription: raw.description || "",
      date: this.standardizeDate(raw.date),
      time: this.standardizeTime(raw.time || "18:00"),
      venueName: raw.venue || "TBA",
      venueAddress: raw.address || "",
      city: this.standardizeCity(raw.city),
      state: this.inferState(raw.city, raw.state),
      imageUrl: raw.imageUrl || this.getDefaultImageForCategory(raw.category),
      price: this.standardizePrice(raw.price),
      isFree: raw.isFree || this.standardizePrice(raw.price) === 0,
      latitude: raw.latitude || this.getDefaultLatitude(raw.city),
      longitude: raw.longitude || this.getDefaultLongitude(raw.city),
      category: this.categorizeEvent(raw.category, raw.title, raw.description),
      organizer: raw.organizer || source.name,
      tags: this.generateTags(raw),

      // Metadata
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: raw.sourceUrl,
      originalId: raw.id,
      lastUpdated: new Date().toISOString(),
      isVerified: false,
      aggregationScore: this.calculateQualityScore(raw),
    };
  }

  private async saveEvents(
    events: AggregatedEvent[]
  ): Promise<{ added: number; updated: number }> {
    // This would integrate with your database
    // For now, we'll add them to the existing mockEvents array

    let added = 0;
    let updated = 0;

    // In a real implementation, you'd:
    // 1. Check for duplicates by title/date/venue
    // 2. Update existing events or create new ones
    // 3. Store in your database

    events.forEach((event) => {
      // Mock logic - in reality you'd check your database
      const exists = false; // this.checkIfEventExists(event)

      if (exists) {
        updated++;
      } else {
        added++;
        // Add to your events data store
      }
    });

    return { added, updated };
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private standardizeDate(date: string): string {
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  }

  private standardizeTime(time: string): string {
    // Convert various time formats to HH:MM
    return time.match(/\d{2}:\d{2}/) ? time : "18:00";
  }

  private standardizeCity(city: string): string {
    const cityMap: Record<string, string> = {
      mumbai: "Mumbai",
      delhi: "New Delhi",
      bangalore: "Bengaluru",
      bengaluru: "Bengaluru",
      hyderabad: "Hyderabad",
      chennai: "Chennai",
      pune: "Pune",
      kolkata: "Kolkata",
    };

    return cityMap[city.toLowerCase()] || city;
  }

  private inferState(city: string, state?: string): string {
    if (state) return state;

    const stateMap: Record<string, string> = {
      Mumbai: "Maharashtra",
      "New Delhi": "Delhi",
      Bengaluru: "Karnataka",
      Hyderabad: "Telangana",
      Chennai: "Tamil Nadu",
      Pune: "Maharashtra",
      Kolkata: "West Bengal",
    };

    return stateMap[city] || "Unknown";
  }

  private standardizePrice(price: number | string | undefined): number {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const numPrice = parseFloat(price.replace(/[^\d.]/g, ""));
      return isNaN(numPrice) ? 0 : numPrice;
    }
    return 0;
  }

  private categorizeEvent(
    category?: string,
    title?: string,
    description?: string
  ): EventCategory {
    const text = `${category} ${title} ${description}`.toLowerCase();

    if (
      text.includes("music") ||
      text.includes("concert") ||
      text.includes("band")
    )
      return "music";
    if (
      text.includes("tech") ||
      text.includes("startup") ||
      text.includes("coding")
    )
      return "technology";
    if (
      text.includes("food") ||
      text.includes("restaurant") ||
      text.includes("culinary")
    )
      return "food";
    if (
      text.includes("art") ||
      text.includes("design") ||
      text.includes("creative")
    )
      return "arts";
    if (
      text.includes("business") ||
      text.includes("networking") ||
      text.includes("conference")
    )
      return "business";
    if (
      text.includes("comedy") ||
      text.includes("standup") ||
      text.includes("humor")
    )
      return "comedy";
    if (
      text.includes("sport") ||
      text.includes("fitness") ||
      text.includes("game")
    )
      return "sports";
    if (
      text.includes("wellness") ||
      text.includes("yoga") ||
      text.includes("meditation")
    )
      return "wellness";

    return "business"; // Default category
  }

  private generateTags(raw: RawEventData): string[] {
    const tags: string[] = [];

    if (raw.tags) tags.push(...raw.tags);
    if (raw.isFree) tags.push("free");
    if (raw.category) tags.push(raw.category.toLowerCase());

    return Array.from(new Set(tags)).slice(0, 5); // Limit to 5 unique tags
  }

  private calculateQualityScore(raw: RawEventData): number {
    let score = 0;

    if (raw.title) score += 20;
    if (raw.description && raw.description.length > 50) score += 20;
    if (raw.venue) score += 15;
    if (raw.address) score += 15;
    if (raw.imageUrl) score += 10;
    if (raw.price !== undefined) score += 10;
    if (raw.latitude && raw.longitude) score += 10;

    return Math.min(score, 100);
  }

  private getDefaultImageForCategory(category?: string): string {
    const defaultImages: Record<string, string> = {
      music:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&auto=format&fit=crop",
      technology:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&auto=format&fit=crop",
      food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&auto=format&fit=crop",
      default:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&auto=format&fit=crop",
    };

    return (
      defaultImages[category?.toLowerCase() || "default"] ||
      defaultImages.default
    );
  }

  private getDefaultLatitude(city: string): number {
    const coords: Record<string, number> = {
      Mumbai: 19.076,
      "New Delhi": 28.7041,
      Bengaluru: 12.9716,
      Hyderabad: 17.385,
      Chennai: 13.0827,
      Pune: 18.5204,
      Kolkata: 22.5726,
    };

    return coords[city] || 28.7041; // Default to Delhi
  }

  private getDefaultLongitude(city: string): number {
    const coords: Record<string, number> = {
      Mumbai: 72.8777,
      "New Delhi": 77.1025,
      Bengaluru: 77.5946,
      Hyderabad: 78.4867,
      Chennai: 80.2707,
      Pune: 73.8567,
      Kolkata: 88.3639,
    };

    return coords[city] || 77.1025; // Default to Delhi
  }

  // Mock data generators (replace with real API calls)
  private async getMockEventbriteEvents(city: string): Promise<RawEventData[]> {
    // This would be replaced with actual Eventbrite API calls
    return [
      {
        id: `eb_${city}_1`,
        title: `Tech Conference ${city} 2025`,
        description: `The biggest technology conference in ${city}`,
        date: "2025-08-15",
        time: "09:00",
        venue: `${city} Convention Center`,
        address: `Main Street, ${city}`,
        city: city,
        price: 1500,
        isFree: false,
        sourceUrl: `https://eventbrite.com/tech-${city}`,
        category: "technology",
        organizer: "TechEvents",
      },
    ];
  }

  private async getMockMeetupEvents(city: string): Promise<RawEventData[]> {
    return [
      {
        id: `meetup_${city}_1`,
        title: `${city} Startup Networking`,
        description: `Monthly networking event for startups in ${city}`,
        date: "2025-07-20",
        time: "18:30",
        venue: `Co-working Space ${city}`,
        address: `Business District, ${city}`,
        city: city,
        price: 0,
        isFree: true,
        sourceUrl: `https://meetup.com/startup-${city}`,
        category: "business",
        organizer: "Startup Community",
      },
    ];
  }

  private async getMockBookMyShowEvents(city: string): Promise<RawEventData[]> {
    return [
      {
        id: `bms_${city}_1`,
        title: `Live Music Concert - ${city}`,
        description: `Amazing live music performance in ${city}`,
        date: "2025-09-05",
        time: "19:00",
        venue: `${city} Arena`,
        address: `Entertainment District, ${city}`,
        city: city,
        price: 2000,
        isFree: false,
        sourceUrl: `https://bookmyshow.com/music-${city}`,
        category: "music",
        organizer: "BookMyShow",
      },
    ];
  }
}
