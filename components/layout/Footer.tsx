// components/layout/Footer.tsx
import React from "react";
import Link from "next/link";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">EventSphere India</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover amazing events across India. From concerts to
              conferences, festivals to workshops - find your next great
              experience.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@eventsphere.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
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
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
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

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 EventSphere India. All rights reserved. Built with ❤️ for the
            Indian event community.
          </p>
        </div>
      </div>
    </footer>
  );
}
