import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import { ArrowRight, Calendar, MapPin, Search, Users } from "lucide-react";

import { mockEvents } from "@/lib/data";
export default function HomePage() {
  const featuredEvents = mockEvents.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-[600px] flex items-center">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                Discover Amazing Events
                <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                  Across India
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fadeIn">
                From concerts to conferences, festivals to workshops - find your
                next great experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
                <Link href="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-900 hover:opacity-90 bg-gray-50 px-8 py-4 text-lg font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Explore Events
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-900 hover:opacity-90 bg-gray-50  px-8 py-4 text-lg font-semibold"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <Calendar className="h-20 w-20 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <MapPin className="h-16 w-16 text-blue-400 animate-pulse" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose EventSphere?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make it easy to discover, book, and enjoy amazing events
                across India
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Discovery</h3>
                <p className="text-gray-600">
                  Find events by location, category, price, and more with our
                  powerful search filters
                </p>
              </div>

              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Seamless Booking</h3>
                <p className="text-gray-600">
                  Book your tickets instantly with our secure and user-friendly
                  booking system
                </p>
              </div>

              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Trusted Community
                </h3>
                <p className="text-gray-600">
                  Join thousands of event-goers and discover events from
                  verified organizers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <FeaturedEvents events={featuredEvents} />

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-lg text-gray-600">
                Explore events by category and find exactly what you're looking
                for
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Music",
                  icon: "🎵",
                  color: "bg-red-100 text-red-800",
                  link: "/events?category=music",
                },
                {
                  name: "Technology",
                  icon: "💻",
                  color: "bg-blue-100 text-blue-800",
                  link: "/events?category=technology",
                },
                {
                  name: "Food",
                  icon: "🍕",
                  color: "bg-yellow-100 text-yellow-800",
                  link: "/events?category=food",
                },
                {
                  name: "Arts",
                  icon: "🎨",
                  color: "bg-purple-100 text-purple-800",
                  link: "/events?category=arts",
                },
                {
                  name: "Sports",
                  icon: "⚽",
                  color: "bg-green-100 text-green-800",
                  link: "/events?category=sports",
                },
                {
                  name: "Comedy",
                  icon: "😂",
                  color: "bg-pink-100 text-pink-800",
                  link: "/events?category=comedy",
                },
                {
                  name: "Business",
                  icon: "💼",
                  color: "bg-gray-100 text-gray-800",
                  link: "/events?category=business",
                },
                {
                  name: "Wellness",
                  icon: "🧘",
                  color: "bg-teal-100 text-teal-800",
                  link: "/events?category=wellness",
                },
              ].map((category) => (
                <Link key={category.name} href={category.link}>
                  <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer group bg-white">
                    <div
                      className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Discover Your Next Event?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of event-goers who trust EventSphere for their
              entertainment needs
            </p>
            <Link href="/events">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Browse All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
