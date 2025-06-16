"use client";
import React, { useState } from "react";
import {
  Crown,
  Calendar,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { useRouter } from "next/navigation";

const BecomeOrganizerComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleBecomeOrganizer = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please log in to become an organizer");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/become-organizer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth_token", data.token); // Add this line
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/organizer/dashboard";
        }, 2000);
      } else if (data.message === "You are already an organizer!") {
        router.push("/organizer/dashboard");
        return;
      } else {
        setError(data.message || "Failed to upgrade to organizer");
      }
    } catch (_) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, Organizer!
          </h1>
          <p className="text-gray-600 mb-6">
            You're now an event organizer. Redirecting to your dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden mt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Become an{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Event Organizer
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of event organizers across India. Create, manage,
              and promote your events with our powerful platform designed for
              success.
            </p>

            {error && (
              <div className="mb-6 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={handleBecomeOrganizer}
              disabled={loading}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transform transition hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  Start Organizing Events
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              Free to start • No setup fees • Instant activation
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose EventSphere?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to create successful events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Easy Event Creation
            </h3>
            <p className="text-gray-600">
              Create stunning events in minutes with our intuitive form. Add
              images, set pricing, and customize every detail.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Attendee Management
            </h3>
            <p className="text-gray-600">
              Track registrations, manage capacity, and connect with your
              audience. Real-time dashboard shows your event performance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center transform transition hover:scale-105">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Grow Your Reach
            </h3>
            <p className="text-gray-600">
              Reach thousands of potential attendees across India. Your events
              appear in our discovery platform automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Join India&apos;s Fastest Growing Event Platform
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Professional Dashboard
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive analytics and management tools
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Multiple Event Types
                    </h3>
                    <p className="text-gray-600">
                      Workshops, conferences, concerts, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Custom Categories
                    </h3>
                    <p className="text-gray-600">
                      Create your own event categories and niches
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      File Upload Support
                    </h3>
                    <p className="text-gray-600">
                      Upload event images and promotional materials
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Draft & Publish
                    </h3>
                    <p className="text-gray-600">
                      Work on events privately, publish when ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Instant organizer access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>No approval process required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Start creating events immediately</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Free to use with no hidden fees</span>
                </div>
              </div>

              <button
                onClick={handleBecomeOrganizer}
                disabled={loading}
                className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition duration-200 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Become an Organizer Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there any cost to become an organizer?
              </h3>
              <p className="text-gray-600">
                No! Becoming an organizer is completely free. You can create and
                manage events without any setup fees or monthly charges.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly can I start creating events?
              </h3>
              <p className="text-gray-600">
                Immediately! Once you become an organizer, you'll have instant
                access to create, edit, and publish events. No waiting period or
                approval process.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I create both free and paid events?
              </h3>
              <p className="text-gray-600">
                Yes! You can create both free and paid events. Set your own
                pricing and manage ticket sales through our platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What support do I get as an organizer?
              </h3>
              <p className="text-gray-600">
                You&apos;ll get access to our organizer dashboard, analytics
                tools, and customer support. Plus, your events will be promoted
                on our platform to reach more attendees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeOrganizerComponent;
