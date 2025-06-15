// app/admin/scraping/page.tsx - Enhanced admin dashboard

"use client";

import { useState, useEffect } from "react";

interface ScrapingStatus {
  lastRun: string | null;
  totalEventsInDatabase: number;
  eventsBySource: Array<{ source: string; count: number }>;
  eventsByCategory: Array<{ category: string; count: number }>;
  apiKeysConfigured: {
    ticketmaster: boolean;
    predicthq: boolean;
  };
  databaseConnected: boolean;
  recentResults: Array<{
    source: string;
    success: boolean;
    eventsFound: number;
    eventsAdded: number;
    timestamp: string;
    errors: string[];
  }>;
}

export default function EnhancedAdminDashboard() {
  const [status, setStatus] = useState<ScrapingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "sources" | "logs" | "settings"
  >("overview");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-49), `[${timestamp}] ${message}`]); // Keep last 50 logs
  };

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/scrape-events");
      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
        addLog("✅ Status refreshed successfully");
      } else {
        addLog(`❌ Failed to fetch status: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Error fetching status: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startScraping = async () => {
    try {
      setIsScraping(true);
      addLog("🚀 Starting real event scraping...");

      const response = await fetch("/api/admin/scrape-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        addLog("✅ Scraping completed successfully!");
        addLog(
          `📊 Summary: ${data.summary.totalEventsFound} found, ${data.summary.totalEventsAdded} added`
        );

        // Log results for each source
        data.results?.forEach((result: any) => {
          const status = result.success ? "✅" : "❌";
          addLog(
            `${status} ${result.source}: ${result.eventsFound} found, ${result.eventsAdded} added`
          );

          if (result.errors?.length > 0) {
            result.errors.forEach((error: string) => {
              addLog(`   ⚠️ ${error}`);
            });
          }
        });

        // Show API key status
        if (data.summary.hasApiKeys) {
          addLog(
            `🔑 API Keys: Ticketmaster ${
              data.summary.hasApiKeys.ticketmaster ? "✅" : "❌"
            }, PredictHQ ${data.summary.hasApiKeys.predicthq ? "✅" : "❌"}`
          );
        }

        // Refresh status
        await fetchStatus();
      } else {
        addLog(`❌ Scraping failed: ${data.error}`);
        if (data.debug) {
          addLog(`🐛 Debug: ${JSON.stringify(data.debug)}`);
        }
      }
    } catch (error) {
      addLog(`❌ Error during scraping: ${error}`);
    } finally {
      setIsScraping(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("🗑️ Logs cleared");
  };

  useEffect(() => {
    fetchStatus();
    addLog("🎯 Admin dashboard loaded");
  }, []);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "ticketmaster":
        return "🎫";
      case "predicthq":
        return "📊";
      case "allevents":
        return "🌐";
      case "google_events":
        return "🔍";
      case "curated":
        return "✨";
      default:
        return "📅";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "ticketmaster":
        return "bg-blue-100 text-blue-800";
      case "predicthq":
        return "bg-green-100 text-green-800";
      case "allevents":
        return "bg-purple-100 text-purple-800";
      case "google_events":
        return "bg-orange-100 text-orange-800";
      case "curated":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                EventSphere Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time event data aggregation and monitoring
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={fetchStatus}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {isLoading ? "🔄 Loading..." : "🔄 Refresh"}
              </button>

              <button
                onClick={startScraping}
                disabled={isScraping || !status?.databaseConnected}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  isScraping || !status?.databaseConnected
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isScraping ? "🔄 Scraping..." : "🚀 Start Real Scraping"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Database Status
            </h3>
            <p
              className={`text-2xl font-bold ${
                status?.databaseConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {status?.databaseConnected ? "✅ Connected" : "❌ Disconnected"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
            <p className="text-2xl font-bold text-blue-600">
              {status?.totalEventsInDatabase || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">API Keys</h3>
            <div className="space-y-1">
              <p
                className={`text-sm font-semibold ${
                  status?.apiKeysConfigured?.ticketmaster
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Ticketmaster:{" "}
                {status?.apiKeysConfigured?.ticketmaster ? "✅" : "⚠️ Optional"}
              </p>
              <p
                className={`text-sm font-semibold ${
                  status?.apiKeysConfigured?.predicthq
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                PredictHQ:{" "}
                {status?.apiKeysConfigured?.predicthq ? "✅" : "⚠️ Optional"}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Last Run</h3>
            <p className="text-sm text-gray-600">
              {status?.lastRun
                ? new Date(status.lastRun).toLocaleString()
                : "Never"}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                {
                  id: "overview",
                  label: "📊 Overview",
                  count: status?.totalEventsInDatabase,
                },
                {
                  id: "sources",
                  label: "🔌 Data Sources",
                  count: status?.eventsBySource?.length,
                },
                { id: "logs", label: "📝 Live Logs", count: logs.length },
                { id: "settings", label: "⚙️ Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Events by Source */}
                {status?.eventsBySource && status.eventsBySource.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Events by Source
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {status.eventsBySource.map((item, index) => (
                        <div
                          key={index}
                          className="text-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="text-2xl mb-2">
                            {getSourceIcon(item.source)}
                          </div>
                          <p className="text-sm font-medium text-gray-500 capitalize">
                            {item.source}
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {item.count}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events by Category */}
                {status?.eventsByCategory &&
                  status.eventsByCategory.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Events by Category
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {status.eventsByCategory.map((item, index) => (
                          <div
                            key={index}
                            className="text-center p-4 bg-gray-50 rounded-lg"
                          >
                            <p className="text-sm font-medium text-gray-500 capitalize">
                              {item.category}
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {item.count}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Recent Results */}
                {status?.recentResults && status.recentResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Scraping Results
                    </h3>
                    <div className="space-y-3">
                      {status.recentResults.map((result, index) => (
                        <div
                          key={index}
                          className={`border-l-4 p-4 rounded-r-lg ${
                            result.success
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">
                                {result.success ? "✅" : "❌"}{" "}
                                {getSourceIcon(result.source)} {result.source}
                              </p>
                              <p className="text-sm text-gray-600">
                                Found: {result.eventsFound}, Added:{" "}
                                {result.eventsAdded}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {result.errors.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-red-600">
                                Errors:
                              </p>
                              {result.errors.map((error, errorIndex) => (
                                <p
                                  key={errorIndex}
                                  className="text-sm text-red-500"
                                >
                                  • {error}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sources Tab */}
            {selectedTab === "sources" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Data Sources
                </h3>

                <div className="grid gap-6">
                  {[
                    {
                      id: "ticketmaster",
                      name: "Ticketmaster Discovery API",
                      description:
                        "Official events, concerts, sports from major venues",
                      status: status?.apiKeysConfigured?.ticketmaster
                        ? "Connected"
                        : "Available",
                      type: "API",
                      features: [
                        "Concerts",
                        "Sports",
                        "Theater",
                        "Family Events",
                      ],
                      setup: "Get free API key from developer.ticketmaster.com",
                    },
                    {
                      id: "predicthq",
                      name: "PredictHQ Events API",
                      description:
                        "AI-powered event intelligence and cultural events",
                      status: status?.apiKeysConfigured?.predicthq
                        ? "Connected"
                        : "Available",
                      type: "API",
                      features: [
                        "Festivals",
                        "Cultural Events",
                        "AI Ranking",
                        "Impact Analysis",
                      ],
                      setup: "Sign up for free tier at predicthq.com",
                    },
                    {
                      id: "allevents",
                      name: "AllEvents.in",
                      description: "Public event discovery platform scraping",
                      status: "Active",
                      type: "Web Scraping",
                      features: [
                        "Local Events",
                        "Community Events",
                        "Workshops",
                        "Meetups",
                      ],
                      setup: "No setup required - works immediately",
                    },
                    {
                      id: "google_events",
                      name: "Google Events Discovery",
                      description:
                        "Search-based event discovery and trending events",
                      status: "Active",
                      type: "Search-based",
                      features: [
                        "Search Discovery",
                        "Trending Events",
                        "Location-based",
                      ],
                      setup: "No setup required - works immediately",
                    },
                  ].map((source) => (
                    <div key={source.id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getSourceIcon(source.id)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {source.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {source.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              source.status === "Connected"
                                ? "bg-green-100 text-green-800"
                                : source.status === "Active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {source.status}
                          </span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {source.type}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Features:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {source.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white text-gray-600 rounded text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        <strong>Setup:</strong> {source.setup}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {selectedTab === "logs" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Live Scraping Logs
                  </h3>
                  <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ Clear Logs
                  </button>
                </div>

                <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-gray-500">
                      No logs yet. Click "Start Real Scraping" to begin.
                    </p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {selectedTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configuration Settings
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🚀 Quick Start Guide
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      1. Your system works immediately with AllEvents.in and
                      Google discovery
                    </p>
                    <p>
                      2. Add API keys below for more data sources (optional but
                      recommended)
                    </p>
                    <p>3. Click "Start Real Scraping" to fetch fresh events</p>
                    <p>4. Events automatically appear on your homepage</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Environment Variables (.env.local)
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Ticketmaster API Key:
                        </label>
                        <code className="block mt-1 p-2 bg-gray-800 text-green-400 rounded">
                          TICKETMASTER_API_KEY=your_key_here
                        </code>
                        <p className="text-gray-600 text-xs mt-1">
                          Get free API key from{" "}
                          <a
                            href="https://developer.ticketmaster.com/"
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            developer.ticketmaster.com
                          </a>
                        </p>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium">
                          PredictHQ Access Token:
                        </label>
                        <code className="block mt-1 p-2 bg-gray-800 text-green-400 rounded">
                          PREDICTHQ_ACCESS_TOKEN=your_token_here
                        </code>
                        <p className="text-gray-600 text-xs mt-1">
                          Sign up for free tier at{" "}
                          <a
                            href="https://www.predicthq.com/"
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            predicthq.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      ⚠️ Important Notes
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Restart your dev server after adding API keys</li>
                      <li>
                        • API keys are optional - basic scraping works without
                        them
                      </li>
                      <li>
                        • Free tiers: Ticketmaster (5000 req/day), PredictHQ
                        (1000 req/month)
                      </li>
                      <li>
                        • Be respectful with scraping rates (built-in delays
                        included)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
