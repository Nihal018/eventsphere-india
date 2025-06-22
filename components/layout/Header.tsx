"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCity } from "@/contexts/CityContext";
import {
  Menu,
  X,
  Calendar,
  LogOut,
  Crown,
  Plus,
  BarChart3,
  User,
  Home,
} from "lucide-react";
import { isAuthenticated, removeAuthToken } from "@/lib/utils";
import CitySelector from "@/components/CitySelector";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { selectedCity, setSelectedCity } = useCity();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Get user role from token
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "USER");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Get saved city from localStorage
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, [setSelectedCity]);

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);

    // If on events page, apply city filter
    if (window.location.pathname === "/events") {
      const url = new URL(window.location.href);
      url.searchParams.set("city", city);
      router.push(url.pathname + url.search);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest("[data-mobile-menu]")) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-lg border-b fixed top-0 z-50 w-full">
        <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 py-4 sm:h-16">
            {/* Logo - Mobile Optimized */}
            <Link
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-6 sm:ml-10"
              onClick={closeMenu}
            >
              <Calendar className="h-7 w-7 text-primary mb-4 sm:mb-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-lg sm:text-2xl font-bold gradient-text leading-tight">
                  EventSphere
                </span>
                <span className="text-xs  sm:text-sm bg-orange-100 text-orange-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full w-max">
                  India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              {/* City Selector */}
              <CitySelector
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
              <Link
                href="/events"
                className="hover:text-primary hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                Browse Events
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {/* Organizer Navigation */}
                  {isOrganizer ? (
                    <>
                      <Link
                        href="/organizer/dashboard"
                        className="text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/organizer/events/new"
                        className="text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Event</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/become-organizer"
                      className="text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Crown className="h-4 w-4" />
                      <span>Become Organizer</span>
                    </Link>
                  )}

                  <Link
                    href="/my-bookings"
                    className="text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:text-primary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="hover:text-primary transition-colors"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      variant="ghost"
                      className="hover:text-primary transition-colors"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile/Tablet City Selector & Menu */}
            <div
              className="flex items-center space-x-2 lg:hidden"
              data-mobile-menu
            >
              {/* Mobile City Selector - Compact */}
              <div className="hidden sm:block lg:hidden">
                <CitySelector
                  selectedCity={selectedCity}
                  onCityChange={handleCityChange}
                />
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2"
                data-mobile-menu
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={closeMenu}
          />

          {/* Mobile Menu */}
          <div
            className="fixed top-14 sm:top-16 left-0 right-0 bg-white border-t border-gray-700 shadow-lg lg:hidden z-50 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto"
            data-mobile-menu
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile City Selector - Only show on small screens */}
              <div className="sm:hidden  px-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Select City:
                </p>
                <CitySelector
                  selectedCity={selectedCity}
                  onCityChange={handleCityChange}
                />
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 p-3 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  <Home className="h-5 w-5 flex-shrink-0" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/events"
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  <Calendar className="h-5 w-5 flex-shrink-0" />
                  <span>Browse Events</span>
                </Link>

                {isLoggedIn ? (
                  <>
                    {/* User-specific Navigation */}
                    <div className=" space-y-1 pt-1">
                      <p className="text-sm font-medium text-gray-500 mb-3 px-3">
                        My Account
                      </p>

                      <Link
                        href="/my-bookings"
                        className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                        onClick={closeMenu}
                      >
                        <User className="h-5 w-5 flex-shrink-0" />
                        <span>My Bookings</span>
                      </Link>

                      {/* Organizer Navigation */}
                      {isOrganizer ? (
                        <div className=" pt-1 space-y-1">
                          <p className="text-sm font-medium text-gray-500 mb-1 px-3">
                            Organizer
                          </p>

                          <Link
                            href="/organizer/dashboard"
                            className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                            onClick={closeMenu}
                          >
                            <BarChart3 className="h-5 w-5 flex-shrink-0" />
                            <span>Dashboard</span>
                          </Link>

                          <Link
                            href="/organizer/events/new"
                            className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                            onClick={closeMenu}
                          >
                            <Plus className="h-5 w-5 flex-shrink-0" />
                            <span>Create Event</span>
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href="/become-organizer"
                          className="flex items-center space-x-3 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                          onClick={closeMenu}
                        >
                          <Crown className="h-5 w-5 flex-shrink-0" />
                          <span>Become Organizer</span>
                        </Link>
                      )}

                      {/* Logout */}
                      <div className=" ">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-3 rounded-lg transition-colors w-full text-left"
                        >
                          <LogOut className="h-5 w-5 flex-shrink-0" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Auth Links */}
                    <div className="  ">
                      <Link href="/auth/login" onClick={closeMenu}>
                        <div className="flex items-center space-x-1 text-gray-700 hover:text-primary hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors w-full">
                          <User className="h-5 w-5 flex-shrink-0" />
                          <span>Login</span>
                        </div>
                      </Link>

                      <Link href="/auth/register" onClick={closeMenu}>
                        <div className="mt-3 px-3">
                          {/* <span>Sign Up</span> */}
                          <Button
                            variant="default"
                            className="w-20 py-3 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors"
                          >
                            Sign Up
                          </Button>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
