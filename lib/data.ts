import { Event, User } from "@/types";

export const mockEvents: Event[] = [
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
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
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
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
    price: 0,
    isFree: true,
    latitude: 28.6129,
    longitude: 77.2295,
    category: "wellness",
    organizer: "Ministry of AYUSH",
    tags: ["yoga", "wellness", "meditation", "health", "free"],
  },
  {
    id: "4",
    title: "Diljit Dosanjh Live in Concert",
    description:
      "The Punjabi superstar brings his electrifying performance to Hyderabad.",
    detailedDescription:
      'Get ready for an unforgettable night as Diljit Dosanjh, the crown jewel of Punjabi entertainment, takes the stage in Hyderabad. Known for his chart-topping hits and charismatic stage presence, Diljit will perform his greatest hits including "G.O.A.T", "Born to Shine", and many more. This high-energy concert promises incredible live music, stunning visuals, and an atmosphere that will keep you dancing all night long.',
    date: "2025-09-10",
    time: "19:30",
    venueName: "Gachibowli Stadium",
    venueAddress: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    imageUrl:
      "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
    price: 3000,
    isFree: false,
    latitude: 17.4239,
    longitude: 78.3797,
    category: "music",
    organizer: "BookMyShow Live",
    tags: ["punjabi", "bollywood", "concert", "live music", "entertainment"],
  },
  {
    id: "5",
    title: "Street Food Festival Chennai",
    description:
      "Explore the best street food from across Tamil Nadu and South India.",
    detailedDescription:
      "Embark on a culinary journey through the diverse flavors of South Indian street food. This weekend festival features over 50 food stalls serving authentic delicacies from idli-sambar to crispy dosas, spicy chaats, and traditional sweets. Meet local chefs, participate in cooking demonstrations, and enjoy live cultural performances while savoring the incredible variety of regional cuisines.",
    date: "2025-07-28",
    time: "17:00",
    venueName: "Marina Beach",
    venueAddress: "Marina Beach Road, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
    price: 250,
    isFree: false,
    latitude: 13.0827,
    longitude: 80.2707,
    category: "food",
    organizer: "Chennai Food Network",
    tags: ["street food", "south indian", "festival", "culinary", "cultural"],
  },
  {
    id: "6",
    title: "Zakir Khan Stand-Up Comedy",
    description:
      "The king of storytelling comedy brings his latest show to Kolkata.",
    detailedDescription:
      "Join Zakir Khan for an evening filled with laughter as he presents his latest stand-up comedy special. Known for his relatable humor and brilliant storytelling, Zakir will take you through hilarious observations about modern life, relationships, and the quirks of being Indian. This intimate venue setting promises an unforgettable comedy experience with one of India's most beloved comedians.",
    date: "2025-08-05",
    time: "20:00",
    venueName: "Science City Auditorium",
    venueAddress: "JBS Haldane Avenue, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    imageUrl:
      "https://images.unsplash.com/photo-1576267423445-b2f0074b8bbc?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
    price: 1200,
    isFree: false,
    latitude: 22.5726,
    longitude: 88.3639,
    category: "comedy",
    organizer: "Comedy Central India",
    tags: ["stand-up", "comedy", "hindi", "storytelling", "entertainment"],
  },
  {
    id: "7",
    title: "Art & Design Conference 2025",
    description:
      "Leading designers and artists share insights on creativity and innovation.",
    detailedDescription:
      "The premier gathering for creative professionals featuring workshops, exhibitions, and talks by renowned artists, designers, and creative directors. Explore the latest trends in digital art, sustainable design, and creative technology. Network with industry leaders, participate in hands-on workshops, and get inspired by the future of art and design. Perfect for designers, artists, students, and creative enthusiasts.",
    date: "2025-09-15",
    time: "10:00",
    venueName: "Pune International Centre",
    venueAddress: "11 Koregaon Park, Pune",
    city: "Pune",
    state: "Maharashtra",
    imageUrl:
      "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb",
    price: 2000,
    isFree: false,
    latitude: 18.5204,
    longitude: 73.8567,
    category: "arts",
    organizer: "Design Council India",
    tags: ["design", "art", "conference", "creativity", "workshops"],
  },
];

// Mock users for POC
export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@eventsphere.in",
    username: "demo_user",
    password: "password123", // In real app, this would be hashed
    firstName: "Demo",
    lastName: "User",
    phone: "+91-9876543210",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

// Helper function to get unique cities
export const getUniqueCities = (): string[] => {
  return [...new Set(mockEvents.map((event) => event.city))].sort();
};

// Helper function to get unique states
export const getUniqueStates = (): string[] => {
  return [...new Set(mockEvents.map((event) => event.state))].sort();
};

// Helper function to get unique categories
export const getUniqueCategories = (): string[] => {
  return [...new Set(mockEvents.map((event) => event.category))].sort();
};
