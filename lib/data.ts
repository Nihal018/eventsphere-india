import { Event, User } from "@/types";

// Original curated events
export const curatedEvents: Event[] = [
  {
    id: "1",
    title: "Sunburn Arena ft. Martin Garrix",
    description:
      "The biggest electronic music festival returns to Mumbai with international headliners.",
    detailedDescription:
      "Get ready for the ultimate electronic music experience as Sunburn Arena presents Martin Garrix live in Mumbai. This high-energy event will feature stunning visual production, world-class sound systems, and an unforgettable night of progressive house and electronic beats. Join thousands of music lovers for this epic celebration of electronic dance music.",
    date: "2025-07-15",
    time: "18:00",
    venueName: "MMRDA Grounds",
    venueAddress: "Bandra Kurla Complex, Bandra East, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 2500,
    isFree: false,
    latitude: 19.0596,
    longitude: 72.8656,
    category: "music",
    organizer: "Sunburn",
    tags: ["electronic", "dance", "music", "festival", "nightlife"],
  },
  {
    id: "2",
    title: "TechCrunch Startup Battlefield",
    description:
      "The ultimate startup competition where emerging companies pitch to top VCs and tech leaders.",
    detailedDescription:
      "TechCrunch Startup Battlefield brings together the most promising startups from across India to compete for the ultimate prize. Witness groundbreaking pitches, network with investors, and discover the next big thing in technology. This event features keynote speeches from industry leaders, panel discussions on emerging tech trends, and unparalleled networking opportunities.",
    date: "2025-08-22",
    time: "09:00",
    venueName: "Bengaluru International Exhibition Centre",
    venueAddress: "10th Mile, Tumkur Road, Madavara Post, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1500,
    isFree: false,
    latitude: 13.0827,
    longitude: 77.5877,
    category: "technology",
    organizer: "TechCrunch",
    tags: [
      "startup",
      "technology",
      "venture capital",
      "innovation",
      "networking",
    ],
  },
  {
    id: "3",
    title: "International Yoga Day Celebration",
    description:
      "Join thousands of yoga enthusiasts for a peaceful morning session at India Gate.",
    detailedDescription:
      "Celebrate International Yoga Day with a massive outdoor yoga session at the iconic India Gate. Led by renowned yoga masters, this free event includes guided meditation, breathing exercises, and various yoga styles suitable for all levels. Experience the power of collective mindfulness in the heart of Delhi, followed by healthy refreshments and wellness workshops.",
    date: "2025-06-21",
    time: "06:00",
    venueName: "India Gate Lawns",
    venueAddress: "Rajpath, India Gate, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 0,
    isFree: true,
    latitude: 28.6129,
    longitude: 77.2295,
    category: "wellness",
    organizer: "Ministry of AYUSH",
    tags: ["yoga", "wellness", "meditation", "health", "free"],
  },
];

// Aggregated events from external sources (these would come from your scraping system)
export const aggregatedEvents: Event[] = [
  {
    id: "eventbrite_mumbai_1",
    title: "Digital Marketing Summit Mumbai 2025",
    description:
      "Learn the latest digital marketing strategies from industry experts.",
    detailedDescription:
      "Join us for a comprehensive digital marketing summit featuring keynote speakers from Google, Facebook, and leading Indian startups. Learn about SEO, social media marketing, content strategy, and emerging trends in digital advertising. Perfect for marketing professionals, business owners, and students.",
    date: "2025-08-15",
    time: "09:00",
    venueName: "Mumbai Convention Center",
    venueAddress: "Goregaon East, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1500,
    isFree: false,
    latitude: 19.1663,
    longitude: 72.8526,
    category: "business",
    organizer: "Eventbrite",
    tags: ["digital marketing", "business", "networking", "conference"],
  },
  {
    id: "meetup_delhi_1",
    title: "Delhi Startup Networking Meetup",
    description:
      "Monthly networking event for entrepreneurs and startup enthusiasts.",
    detailedDescription:
      "Connect with fellow entrepreneurs, investors, and startup enthusiasts in Delhi. This monthly meetup features pitch sessions, networking opportunities, and discussions about the latest trends in the Indian startup ecosystem. Whether you're a seasoned entrepreneur or just starting out, this event is perfect for building valuable connections.",
    date: "2025-07-20",
    time: "18:30",
    venueName: "Impact Hub Delhi",
    venueAddress: "Connaught Place, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 0,
    isFree: true,
    latitude: 28.6315,
    longitude: 77.2167,
    category: "business",
    organizer: "Delhi Startup Community",
    tags: ["startup", "networking", "entrepreneurs", "free", "monthly"],
  },
  {
    id: "bookmyshow_bangalore_1",
    title: "Bangalore Music Festival 2025",
    description:
      "Three-day music festival featuring indie artists and popular bands.",
    detailedDescription:
      "Experience the best of Indian and international music at Bangalore Music Festival 2025. This three-day extravaganza features performances by indie artists, popular bands, and emerging talents across multiple genres including rock, pop, electronic, and fusion music. Food stalls, art installations, and interactive experiences await music lovers.",
    date: "2025-09-05",
    time: "16:00",
    venueName: "Palace Grounds",
    venueAddress: "Jayamahal Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    imageUrl:
      "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 2000,
    isFree: false,
    latitude: 13.0067,
    longitude: 77.5834,
    category: "music",
    organizer: "BookMyShow",
    tags: ["music festival", "indie", "bands", "three days", "multiple genres"],
  },
  {
    id: "eventbrite_chennai_1",
    title: "Chennai Food & Culture Festival",
    description: "Celebrate the rich culinary heritage and culture of Chennai.",
    detailedDescription:
      "Immerse yourself in the vibrant food and cultural scene of Chennai. This festival showcases traditional Tamil cuisine, street food, cultural performances, art exhibitions, and cooking demonstrations by renowned chefs. Experience the authentic flavors of South India while enjoying classical music and dance performances.",
    date: "2025-08-28",
    time: "17:00",
    venueName: "Marina Beach Ground",
    venueAddress: "Marina Beach Road, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 300,
    isFree: false,
    latitude: 13.0478,
    longitude: 80.2785,
    category: "food",
    organizer: "Chennai Cultural Society",
    tags: [
      "food festival",
      "tamil culture",
      "south indian",
      "cultural performances",
    ],
  },
  {
    id: "meetup_pune_1",
    title: "Pune Tech Talks: AI & Machine Learning",
    description:
      "Monthly tech talks focusing on AI, ML, and emerging technologies.",
    detailedDescription:
      "Join Pune's tech community for an evening of insightful talks on artificial intelligence and machine learning. This month's session features presentations from data scientists at leading tech companies, hands-on workshops, and networking opportunities. Perfect for developers, data scientists, and technology enthusiasts.",
    date: "2025-07-25",
    time: "19:00",
    venueName: "Pune Tech Park",
    venueAddress: "Hinjewadi Phase 1, Pune",
    city: "Pune",
    state: "Maharashtra",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 0,
    isFree: true,
    latitude: 18.5893,
    longitude: 73.7389,
    category: "technology",
    organizer: "Pune Tech Community",
    tags: ["AI", "machine learning", "tech talks", "networking", "free"],
  },
  {
    id: "bookmyshow_hyderabad_1",
    title: "Stand-up Comedy Night Hyderabad",
    description: "An evening of laughter with popular stand-up comedians.",
    detailedDescription:
      "Get ready for a night full of laughter with some of India's most popular stand-up comedians. This comedy show features both established and emerging comedians performing their latest material. Expect witty observations, hilarious stories, and interactive comedy that will keep you entertained throughout the evening.",
    date: "2025-08-10",
    time: "20:00",
    venueName: "Hyderabad Comedy Club",
    venueAddress: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    imageUrl:
      "https://images.unsplash.com/photo-1597149266671-9b71adbba695?w=800&h=400&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 800,
    isFree: false,
    latitude: 17.4126,
    longitude: 78.4071,
    category: "comedy",
    organizer: "Comedy Nights",
    tags: ["stand-up comedy", "entertainment", "laughter", "popular comedians"],
  },
];

// Combined events (curated + aggregated)
export const mockEvents: Event[] = [...curatedEvents, ...aggregatedEvents];

// Helper functions
export const getUniqueCities = (): string[] => {
  return Array.from(new Set(mockEvents.map((event) => event.city))).sort();
};

export const getUniqueStates = (): string[] => {
  return Array.from(new Set(mockEvents.map((event) => event.state))).sort();
};

export const getUniqueCategories = (): string[] => {
  return Array.from(new Set(mockEvents.map((event) => event.category))).sort();
};

// Get events by source
export const getCuratedEvents = (): Event[] => {
  return curatedEvents;
};

export const getAggregatedEvents = (): Event[] => {
  return aggregatedEvents;
};

// Filter events by source
export const getEventsBySource = (
  source: "curated" | "aggregated" | "all" = "all"
): Event[] => {
  switch (source) {
    case "curated":
      return curatedEvents;
    case "aggregated":
      return aggregatedEvents;
    default:
      return mockEvents;
  }
};

// Get event statistics
export const getEventStatistics = () => {
  return {
    total: mockEvents.length,
    curated: curatedEvents.length,
    aggregated: aggregatedEvents.length,
    byCategory: getUniqueCategories().map((category) => ({
      category,
      count: mockEvents.filter((event) => event.category === category).length,
    })),
    byCity: getUniqueCities().map((city) => ({
      city,
      count: mockEvents.filter((event) => event.city === city).length,
    })),
    freeEvents: mockEvents.filter((event) => event.isFree).length,
    paidEvents: mockEvents.filter((event) => !event.isFree).length,
  };
};
