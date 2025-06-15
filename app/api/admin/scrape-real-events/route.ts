// app/api/admin/scrape-real-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { RealDataScraperService } from "../../../../lib/scrappers/realScrapperService";

export async function POST(request: NextRequest) {
  console.log("🚀 Real data scraping API endpoint called");

  try {
    // Skip auth for POC - in production, add proper authentication

    console.log("✅ Starting real data scraping from multiple sources...");

    // Check database connection
    const dbStatus = await DatabaseService.getConnectionStatus();
    if (!dbStatus.connected) {
      console.error("❌ Database connection failed:", dbStatus.error);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbStatus.error,
        },
        { status: 500 }
      );
    }

    console.log("✅ Database connected, initializing sources...");

    // Initialize database sources
    await DatabaseService.initializeEventSources();

    console.log("✅ Sources initialized, starting real data scraping...");

    // Start real data scraping
    const scraper = new RealDataScraperService();
    const results = await scraper.scrapeAllRealSources();

    // Calculate summary stats
    const summary = {
      totalSources: results.length,
      successfulSources: results.filter((r) => r.success).length,
      totalEventsFound: results.reduce((sum, r) => sum + r.eventsFound, 0),
      totalEventsAdded: results.reduce((sum, r) => sum + r.eventsAdded, 0),
      totalEventsUpdated: results.reduce((sum, r) => sum + r.eventsUpdated, 0),
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      apiKeysConfigured: {
        ticketmaster: !!process.env.TICKETMASTER_API_KEY,
        predicthq: !!process.env.PREDICTHQ_ACCESS_TOKEN,
      },
      sourcesAttempted: results.map((r) => ({
        source: r.source,
        success: r.success,
        eventsFound: r.eventsFound,
        eventsAdded: r.eventsAdded,
        errors: r.errors,
      })),
    };

    console.log("✅ Real data scraping completed:", summary);

    return NextResponse.json({
      success: true,
      message: "Real event data scraping completed successfully",
      summary,
      results,
      instructions: {
        ticketmaster:
          "Get free API key from https://developer.ticketmaster.com/",
        predicthq: "Sign up for free tier at https://www.predicthq.com/",
        allevents: "Public scraping (no API key needed)",
        google_events: "Enhanced search-based discovery (no API key needed)",
      },
      debug: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseConnected: dbStatus.connected,
        realDataSources: 4,
      },
    });
  } catch (error) {
    console.error("❌ Error in real data scraping API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        message: "Real data scraping failed",
        debug: {
          timestamp: new Date().toISOString(),
          errorType:
            error instanceof Error ? error.constructor.name : "UnknownError",
          stack:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.stack
                : undefined
              : undefined,
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Fetching real data scraping status...");

    // Check database connection
    const dbStatus = await DatabaseService.getConnectionStatus();
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbStatus.error,
        },
        { status: 500 }
      );
    }

    // Get scraping statistics from database
    const stats = await DatabaseService.getScrapingStats();

    // Format recent logs for display
    const recentLogs = stats.recentLogs.map((log) => ({
      id: log.id,
      source: log.source,
      success: log.success,
      eventsFound: log.eventsFound,
      eventsAdded: log.eventsAdded,
      eventsUpdated: log.eventsUpdated,
      errors: log.errors,
      duration: log.duration,
      timestamp: log.timestamp.toISOString(),
    }));

    const realDataSources = [
      {
        id: "ticketmaster",
        name: "Ticketmaster Discovery API",
        type: "API",
        configured: !!process.env.TICKETMASTER_API_KEY,
        signupUrl: "https://developer.ticketmaster.com/",
        description: "Free tier available, covers major venues globally",
        features: ["Concerts", "Sports", "Theater", "Family Events"],
        rateLimit: "5000 requests/day",
      },
      {
        id: "predicthq",
        name: "PredictHQ Events API",
        type: "API",
        configured: !!process.env.PREDICTHQ_ACCESS_TOKEN,
        signupUrl: "https://www.predicthq.com/",
        description: "AI-powered event intelligence, free tier available",
        features: ["Festivals", "Cultural Events", "Sports", "AI Ranking"],
        rateLimit: "1000 requests/month (free tier)",
      },
      {
        id: "allevents",
        name: "AllEvents.in",
        type: "Web Scraping",
        configured: true,
        signupUrl: "https://allevents.in/",
        description: "Public event discovery platform, no API key needed",
        features: ["Local Events", "Community Events", "Workshops", "Meetups"],
        rateLimit: "Respectful scraping (3-5 sec delays)",
      },
      {
        id: "google_events",
        name: "Google Events Discovery",
        type: "Search-based",
        configured: true,
        signupUrl: null,
        description: "Search-based event discovery, no API key needed",
        features: ["Search Discovery", "Trending Events", "Location-based"],
        rateLimit: "Search-based (no official API)",
      },
    ];

    const status = {
      lastRun: recentLogs[0]?.timestamp || null,
      isRunning: false,
      totalEventsInDatabase: stats.totalEvents,
      sourcesConfigured: stats.sources.length,
      realDataSourcesAvailable: realDataSources.length,
      realDataSourcesConfigured: realDataSources.filter((s) => s.configured)
        .length,
      nextScheduledRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      recentResults: recentLogs.slice(0, 5),
      eventsBySource: stats.eventsBySource,
      eventsByCategory: stats.eventsByCategory,
      sources: stats.sources.map((source) => ({
        id: source.id,
        name: source.name,
        enabled: source.enabled,
        lastScrapeTime: source.lastScrapeTime?.toISOString(),
        totalEvents: source.totalEvents,
        successRate: source.successRate,
      })),
      realDataSources: realDataSources,
      apiKeysStatus: {
        ticketmaster: {
          configured: !!process.env.TICKETMASTER_API_KEY,
          required: false,
          note: "Free tier available at developer.ticketmaster.com",
          benefits: "Official venue events, concerts, sports",
        },
        predicthq: {
          configured: !!process.env.PREDICTHQ_ACCESS_TOKEN,
          required: false,
          note: "Free tier available at predicthq.com",
          benefits: "AI-ranked events, festivals, cultural events",
        },
      },
      databaseConnected: dbStatus.connected,
      estimatedEventsPerRun: {
        withoutApiKeys: "5-10 events",
        withApiKeys: "20-50+ events",
        breakdown: {
          ticketmaster: "10-20 events (with API key)",
          predicthq: "5-15 events (with API key)",
          allevents: "3-8 events (always available)",
          google_events: "2-5 events (always available)",
        },
      },
    };

    console.log("✅ Real data status fetched successfully");

    return NextResponse.json({
      success: true,
      status,
      setupInstructions: {
        quickStart: [
          "1. Run POST request to start scraping (works without API keys)",
          "2. Check results - should get events from AllEvents.in and Google discovery",
          "3. Optional: Add API keys for more data sources",
          "4. Visit admin dashboard to monitor progress",
        ],
        apiKeySetup: {
          ticketmaster: {
            priority: "High",
            difficulty: "Easy",
            timeToSetup: "5 minutes",
            steps: [
              "1. Visit https://developer.ticketmaster.com/",
              "2. Create free developer account",
              "3. Create an app to get API key",
              "4. Add TICKETMASTER_API_KEY=your_key to .env.local",
              "5. Restart dev server",
            ],
            benefits: [
              "Official venue events",
              "Concert and sports data",
              "High-quality event information",
              "5000 requests/day free",
            ],
          },
          predicthq: {
            priority: "Medium",
            difficulty: "Easy",
            timeToSetup: "5 minutes",
            steps: [
              "1. Visit https://www.predicthq.com/",
              "2. Sign up for free account",
              "3. Go to account settings",
              "4. Generate access token",
              "5. Add PREDICTHQ_ACCESS_TOKEN=your_token to .env.local",
              "6. Restart dev server",
            ],
            benefits: [
              "AI-ranked events",
              "Cultural and festival data",
              "Event impact intelligence",
              "1000 requests/month free",
            ],
          },
        },
        noApiKeyNeeded: [
          "AllEvents.in scraping works immediately",
          "Google Events discovery works immediately",
          "You can start testing right now!",
        ],
      },
    });
  } catch (error) {
    console.error("❌ Error fetching real data scraping status:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch real data scraping status",
        debug: {
          timestamp: new Date().toISOString(),
          errorType:
            error instanceof Error ? error.constructor.name : "UnknownError",
        },
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  try {
    const dbStatus = await DatabaseService.getConnectionStatus();
    return new NextResponse(null, {
      status: dbStatus.connected ? 200 : 503,
      headers: {
        "X-Database-Status": dbStatus.connected ? "connected" : "disconnected",
        "X-Real-Data-Sources": "4",
        "X-API-Keys-Required": "false",
        "X-Ready-To-Scrape": "true",
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        "X-Database-Status": "error",
        "X-Real-Data-Sources": "0",
        "X-Ready-To-Scrape": "false",
      },
    });
  }
}
