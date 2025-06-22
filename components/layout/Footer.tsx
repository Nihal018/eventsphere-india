// components/layout/Footer.tsx
import React from "react";
import Link from "next/link";
import { Calendar, Mail } from "lucide-react"; // Removed Phone, MapPin as they were not used

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {" "}
        {/* Adjusted vertical padding for mobile to py-8, desktop remains py-12 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-y-0 md:gap-x-8">
          {" "}
          {/* Added gap-y for vertical spacing on mobile, no vertical gap on desktop */}
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />{" "}
              {/* Keep original size */}
              <span className="text-2xl font-bold">EventSphere India</span>{" "}
              {/* Keep original size */}
            </div>
            <p className="text-gray-400 text-base mb-4 sm:text-sm">
              {" "}
              {/* Keep base size for desktop, shrink slightly for mobile */}
              Discover amazing events across India. From concerts to
              conferences, festivals to workshops - find your next great
              experience.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {" "}
              {/* Ensure email wraps/stacks on very small screens */}
              <div className="flex items-center space-x-2 text-gray-400 text-base sm:text-sm">
                {" "}
                {/* Keep base size for desktop, shrink slightly for mobile */}
                <Mail className="h-4 w-4" />
                <span>hello@eventsphere.in</span>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>{" "}
            {/* Keep original size */}
            <ul className="space-y-2 text-base sm:text-sm">
              {" "}
              {/* Keep base size for desktop, shrink slightly for mobile */}
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>{" "}
            {/* Keep original size */}
            <ul className="space-y-2 text-base sm:text-sm">
              {" "}
              {/* Keep base size for desktop, shrink slightly for mobile */}
              <li>
                <Link
                  href="/events?category=music"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=technology"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=food"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Food & Drink
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=arts"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Arts & Culture
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm md:mt-8 md:pt-8 md:text-sm">
          {" "}
          {/* Adjusted margin/padding/text for mobile, desktop remains original */}
          <p className="text-gray-400">
            © 2025 EventSphere India. All rights reserved. Built with ❤️ for the
            Indian event community.
          </p>
        </div>
      </div>
    </footer>
  );
}
