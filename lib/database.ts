import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export class DatabaseService {
  // Initialize default event sources
  static async initializeEventSources() {
    console.log("🔧 Initializing event sources...");

    const sources = [
      {
        id: "eventbrite",
        name: "Eventbrite",
        baseUrl: "https://www.eventbriteapi.com/v3",
        enabled: true,
        rateLimit: 2000,
        totalEvents: 0,
        successRate: 100.0,
      },
      {
        id: "meetup",
        name: "Meetup",
        baseUrl: "https://api.meetup.com",
        enabled: true,
        rateLimit: 3000,
        totalEvents: 0,
        successRate: 100.0,
      },
      {
        id: "bookmyshow",
        name: "BookMyShow",
        baseUrl: "https://in.bookmyshow.com",
        enabled: true,
        rateLimit: 5000,
        totalEvents: 0,
        successRate: 100.0,
      },
      // ADD THE NEW REAL DATA SOURCES
      {
        id: "ticketmaster",
        name: "Ticketmaster",
        baseUrl: "https://app.ticketmaster.com/discovery/v2",
        enabled: true,
        rateLimit: 2000,
        totalEvents: 0,
        successRate: 100.0,
      },
      {
        id: "predicthq",
        name: "PredictHQ",
        baseUrl: "https://api.predicthq.com/v1",
        enabled: true,
        rateLimit: 3000,
        totalEvents: 0,
        successRate: 100.0,
      },
      {
        id: "allevents",
        name: "AllEvents.in",
        baseUrl: "https://allevents.in",
        enabled: true,
        rateLimit: 5000,
        totalEvents: 0,
        successRate: 100.0,
      },
      {
        id: "google_events",
        name: "Google Events",
        baseUrl: "https://google.com",
        enabled: true,
        rateLimit: 2000,
        totalEvents: 0,
        successRate: 100.0,
      },
    ];

    for (const source of sources) {
      try {
        await prisma.eventSource.upsert({
          where: { id: source.id },
          update: {
            enabled: source.enabled,
            rateLimit: source.rateLimit,
            baseUrl: source.baseUrl,
          },
          create: source,
        });
        console.log(`✅ Initialized source: ${source.name}`);
      } catch (error) {
        console.error(`❌ Error initializing source ${source.name}:`, error);
      }
    }

    console.log("✅ Event sources initialized");
  }

  // Save events with duplicate detection
  static async saveEvents(
    events: any[]
  ): Promise<{ added: number; updated: number; duplicates: number }> {
    console.log(`💾 Saving ${events.length} events to database...`);

    let added = 0;
    let updated = 0;
    let duplicates = 0;

    for (const event of events) {
      try {
        // Check for duplicates by ID first (exact match)
        const existingById = await prisma.event.findFirst({
          where: { id: event.id },
        });

        if (existingById) {
          // Update if aggregation score is higher
          if (event.aggregationScore > existingById.aggregationScore) {
            await prisma.event.update({
              where: { id: existingById.id },
              data: {
                ...event,
                updatedAt: new Date(),
              },
            });
            updated++;
            console.log(`🔄 Updated event: ${event.title}`);
          } else {
            duplicates++;
            console.log(`⏭️ Duplicate (lower score): ${event.title}`);
          }
          continue;
        }

        // Check for fuzzy duplicates based on title, date, and venue
        const titleWords = event.title
          .toLowerCase()
          .split(" ")
          .slice(0, 3)
          .join(" ");
        const existing = await prisma.event.findFirst({
          where: {
            AND: [
              {
                title: {
                  contains: titleWords,
                },
              },
              { date: event.date },
              {
                OR: [
                  {
                    venueName: {
                      contains: event.venueName.split(" ")[0],
                    },
                  },
                  { city: event.city },
                ],
              },
            ],
          },
        });

        if (existing) {
          // Update if aggregation score is higher
          if (event.aggregationScore > existing.aggregationScore) {
            await prisma.event.update({
              where: { id: existing.id },
              data: {
                ...event,
                id: existing.id, // Keep original ID
                updatedAt: new Date(),
              },
            });
            updated++;
            console.log(`🔄 Fuzzy updated event: ${event.title}`);
          } else {
            duplicates++;
            console.log(`⏭️ Fuzzy duplicate: ${event.title}`);
          }
        } else {
          // Create new event
          await prisma.event.create({
            data: event,
          });
          added++;
          console.log(`✅ Added new event: ${event.title}`);
        }
      } catch (error) {
        console.error(`❌ Error saving event "${event.title}":`, error);
      }
    }

    console.log(
      `💾 Database save completed: ${added} added, ${updated} updated, ${duplicates} duplicates`
    );
    return { added, updated, duplicates };
  }

  // Get all events with filtering
  static async getEvents(
    filters: {
      city?: string;
      category?: string;
      search?: string;
      source?: string;
      limit?: number;
    } = {}
  ) {
    console.log("📖 Fetching events from database with filters:", filters);

    const where: any = {};

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.source) {
      where.sourceId = filters.source;
    }

    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
          },
        },
        {
          description: {
            contains: filters.search,
          },
        },
      ];
    }

    try {
      const events = await prisma.event.findMany({
        where,
        orderBy: [{ date: "asc" }, { time: "asc" }],
        take: filters.limit || 100,
      });

      console.log(`📖 Retrieved ${events.length} events from database`);

      // Convert back to frontend format
      return events.map((event) => ({
        ...event,
        tags: this.parseJsonField(event.tags, []),
      }));
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      return [];
    }
  }

  // FIXED: Log scraping results with proper error handling
  static async logScrapingResult(result: {
    source: string;
    success: boolean;
    eventsFound: number;
    eventsAdded: number;
    eventsUpdated: number;
    errors: string[];
    duration: number;
  }) {
    try {
      console.log(`📝 Logging scraping result for ${result.source}`);

      // First, ensure the source exists
      await this.ensureSourceExists(result.source);

      // Create the scraping log
      await prisma.scrapingLog.create({
        data: {
          source: result.source,
          success: result.success,
          eventsFound: result.eventsFound,
          eventsAdded: result.eventsAdded,
          eventsUpdated: result.eventsUpdated,
          errors: JSON.stringify(result.errors || []),
          duration: result.duration,
        },
      });

      // Update source statistics with error handling
      try {
        await prisma.eventSource.update({
          where: { id: result.source },
          data: {
            lastScrapeTime: new Date(),
            totalEvents: {
              increment: result.eventsAdded,
            },
            successRate: result.success ? 100.0 : 0.0,
          },
        });
      } catch (updateError) {
        console.warn(
          `⚠️ Could not update source statistics for ${result.source}:`,
          updateError
        );
        // Don't throw - logging is more important than source stats
      }

      console.log(`✅ Logged scraping result for ${result.source}`);
    } catch (error) {
      console.error(
        `❌ Error logging scraping result for ${result.source}:`,
        error
      );
      // Don't throw - we don't want to break scraping because of logging issues
    }
  }

  // NEW: Ensure source exists before updating
  private static async ensureSourceExists(sourceId: string) {
    const existing = await prisma.eventSource.findUnique({
      where: { id: sourceId },
    });

    if (!existing) {
      console.log(`🔧 Creating missing source: ${sourceId}`);

      // Create a basic source record
      const sourceNames: Record<string, string> = {
        ticketmaster: "Ticketmaster",
        predicthq: "PredictHQ",
        allevents: "AllEvents.in",
        google_events: "Google Events",
        eventbrite: "Eventbrite",
        meetup: "Meetup",
        bookmyshow: "BookMyShow",
      };

      await prisma.eventSource.create({
        data: {
          id: sourceId,
          name: sourceNames[sourceId] || sourceId,
          baseUrl: "https://example.com",
          enabled: true,
          rateLimit: 2000,
          totalEvents: 0,
          successRate: 100.0,
        },
      });

      console.log(`✅ Created missing source: ${sourceId}`);
    }
  }

  // Get scraping statistics
  static async getScrapingStats() {
    try {
      console.log("📊 Fetching scraping statistics...");

      const [totalEvents, recentLogs, sources] = await Promise.all([
        prisma.event.count(),
        prisma.scrapingLog.findMany({
          orderBy: { timestamp: "desc" },
          take: 10,
        }),
        prisma.eventSource.findMany(),
      ]);

      const eventsBySource = await prisma.event.groupBy({
        by: ["sourceId"],
        _count: { id: true },
      });

      const eventsByCategory = await prisma.event.groupBy({
        by: ["category"],
        _count: { id: true },
      });

      console.log(`📊 Statistics: ${totalEvents} total events`);

      return {
        totalEvents,
        eventsBySource: eventsBySource.map((item) => ({
          source: item.sourceId || "curated",
          count: item._count.id,
        })),
        eventsByCategory: eventsByCategory.map((item) => ({
          category: item.category,
          count: item._count.id,
        })),
        recentLogs: recentLogs.map((log) => ({
          ...log,
          errors: this.parseJsonField(log.errors, []),
        })),
        sources,
      };
    } catch (error) {
      console.error("❌ Error fetching scraping stats:", error);
      return {
        totalEvents: 0,
        eventsBySource: [],
        eventsByCategory: [],
        recentLogs: [],
        sources: [],
      };
    }
  }

  // Clean old events (maintenance function)
  static async cleanOldEvents(daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deleted = await prisma.event.deleteMany({
        where: {
          date: {
            lt: cutoffDate.toISOString().split("T")[0],
          },
          sourceId: {
            not: null, // Don't delete curated events
          },
        },
      });

      console.log(`🧹 Cleaned ${deleted.count} old events`);
      return deleted.count;
    } catch (error) {
      console.error("❌ Error cleaning old events:", error);
      return 0;
    }
  }

  // Get database connection status
  static async getConnectionStatus() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { connected: true, error: null };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get unique cities from events
  static async getUniqueCities(): Promise<string[]> {
    try {
      const cities = await prisma.event.findMany({
        select: { city: true },
        distinct: ["city"],
      });
      return cities.map((c) => c.city).sort();
    } catch (error) {
      console.error("❌ Error fetching cities:", error);
      return [];
    }
  }

  // Get unique categories from events
  static async getUniqueCategories(): Promise<string[]> {
    try {
      const categories = await prisma.event.findMany({
        select: { category: true },
        distinct: ["category"],
      });
      return categories.map((c) => c.category).sort();
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      return [];
    }
  }

  // Helper method to safely parse JSON fields
  private static parseJsonField(
    jsonString: string | null,
    defaultValue: any = null
  ) {
    if (!jsonString) return defaultValue;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn("⚠️ Failed to parse JSON field:", jsonString);
      return defaultValue;
    }
  }
}
