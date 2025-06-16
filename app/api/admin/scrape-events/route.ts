// app/api/admin/scrape-events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { RealDataScraperService } from "../../../../lib/scrappers/realScrapperService";
import { DatabaseService } from "../../../../lib/database";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting integrated event scraping...");

    // Check database connection
    const dbStatus = await DatabaseService.getConnectionStatus();
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 }
      );
    }

    // Initialize database sources
    await DatabaseService.initializeEventSources();

    // Use the real data scraper instead of mock data
    const scraper = new RealDataScraperService();
    const results = await scraper.scrapeAllRealSources();

    // Calculate summary
    const summary = {
      totalSources: results.length,
      successfulSources: results.filter((r) => r.success).length,
      totalEventsFound: results.reduce((sum, r) => sum + r.eventsFound, 0),
      totalEventsAdded: results.reduce((sum, r) => sum + r.eventsAdded, 0),
      totalEventsUpdated: results.reduce((sum, r) => sum + r.eventsUpdated, 0),
      hasApiKeys: {
        ticketmaster: !!process.env.TICKETMASTER_API_KEY,
        predicthq: !!process.env.PREDICTHQ_ACCESS_TOKEN,
      },
    };

    console.log("✅ Real event scraping completed:", summary);

    return NextResponse.json({
      success: true,
      message: "Real event scraping completed successfully",
      summary,
      results,
      debug: {
        timestamp: new Date().toISOString(),
        databaseConnected: true,
        realDataEnabled: true,
      },
    });
  } catch (error) {
    console.error("❌ Error in event scraping:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
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

export async function GET(request: NextRequest) {
  try {
    // Get scraping statistics from database
    const stats = await DatabaseService.getScrapingStats();

    const status = {
      lastRun: stats.recentLogs[0]?.timestamp?.toISOString() || null,
      isRunning: false,
      totalEventsInDatabase: stats.totalEvents,
      eventsBySource: stats.eventsBySource,
      eventsByCategory: stats.eventsByCategory,
      recentResults: stats.recentLogs.slice(0, 5).map((log) => ({
        source: log.source,
        success: log.success,
        eventsFound: log.eventsFound,
        eventsAdded: log.eventsAdded,
        timestamp: log.timestamp.toISOString(),
        errors: log.errors,
      })),
      apiKeysConfigured: {
        ticketmaster: !!process.env.TICKETMASTER_API_KEY,
        predicthq: !!process.env.PREDICTHQ_ACCESS_TOKEN,
      },
    };

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
