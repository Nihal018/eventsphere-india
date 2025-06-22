// app/events/page.tsx
import { Suspense } from "react";
import EventsPageContent from "./EventsPageContent";

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageFallback />}>
      <EventsPageContent />
    </Suspense>
  );
}

function EventsPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      {/* Mobile-friendly loading header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-white/20 rounded w-3/4 sm:w-1/2 mx-auto mb-3 sm:mb-4"></div>
              <div className="h-4 sm:h-5 bg-white/20 rounded w-full sm:w-3/4 mx-auto mb-4 sm:mb-6"></div>
              <div className="h-8 sm:h-10 bg-white/20 rounded w-full sm:w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="animate-pulse">
          {/* Mobile filter button skeleton */}
          <div className="block lg:hidden mb-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Desktop filters skeleton */}
          <div className="hidden lg:block mb-6">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>

          {/* Results header skeleton */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
              <div className="space-y-2">
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-64 sm:w-80"></div>
              </div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-full sm:w-32"></div>
            </div>
          </div>

          {/* Event grid skeleton - Mobile responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 h-64 sm:h-80 rounded-lg"
              ></div>
            ))}
          </div>

          {/* Additional mobile-specific skeletons */}
          <div className="mt-6 sm:mt-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-20 sm:w-24 bg-gray-200 rounded-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
