"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Menu, X, Calendar, LogOut } from "lucide-react";
import { isAuthenticated, removeAuthToken } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 ml-24">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">
              EventSphere
            </span>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className=" hover:text-primary hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors "
            >
              Home
            </Link>
            <Link
              href="/events"
              className=" hover:text-primary  hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
            >
              Browse Events
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 ">
                <Link
                  href="/my-bookings"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center space-x-2  hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center ">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className=" hover:text-primary transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="ghost"
                    className=" hover:text-primary transition-colors ml-2"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors px-4"
              >
                Home
              </Link>
              <Link
                href="/events"
                className="text-gray-700 hover:text-primary transition-colors px-4"
              >
                Browse Events
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/my-bookings"
                    className="text-gray-700 hover:text-primary transition-colors px-4"
                  >
                    My Bookings
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="mx-4 justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-4">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
