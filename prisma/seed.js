const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed event sources
  const sources = [
    {
      id: "eventbrite",
      name: "Eventbrite",
      baseUrl: "https://www.eventbriteapi.com/v3",
      enabled: true,
      rateLimit: 2000,
      totalEvents: 0,
      successRate: 100.0,
    },
    {
      id: "meetup",
      name: "Meetup",
      baseUrl: "https://api.meetup.com",
      enabled: true,
      rateLimit: 3000,
      totalEvents: 0,
      successRate: 100.0,
    },
    {
      id: "bookmyshow",
      name: "BookMyShow",
      baseUrl: "https://in.bookmyshow.com",
      enabled: true,
      rateLimit: 5000,
      totalEvents: 0,
      successRate: 100.0,
    },
  ];

  for (const source of sources) {
    await prisma.eventSource.upsert({
      where: { id: source.id },
      update: {},
      create: source,
    });
    console.log(`✅ Created/updated source: ${source.name}`);
  }

  // Seed initial curated events
  const curatedEvents = [
    {
      id: "curated_1",
      title: "Sunburn Arena ft. Martin Garrix",
      description:
        "The biggest electronic music festival returns to Mumbai with international headliners.",
      detailedDescription:
        "Get ready for the ultimate electronic music experience as Sunburn Arena presents Martin Garrix live in Mumbai. This high-energy event will feature stunning visual production, world-class sound systems, and an unforgettable night of progressive house and electronic beats.",
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
      tags: JSON.stringify([
        "electronic",
        "dance",
        "music",
        "festival",
        "nightlife",
      ]),
      sourceId: null,
      sourceName: "Curated",
      sourceUrl: "",
      originalId: null,
      isVerified: true,
      aggregationScore: 100,
    },
    {
      id: "curated_2",
      title: "TechCrunch Startup Battlefield",
      description:
        "The ultimate startup competition where emerging companies pitch to top VCs and tech leaders.",
      detailedDescription:
        "TechCrunch Startup Battlefield brings together the most promising startups from across India to compete for the ultimate prize. Witness groundbreaking pitches, network with investors, and discover the next big thing in technology.",
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
      tags: JSON.stringify([
        "startup",
        "technology",
        "venture capital",
        "innovation",
        "networking",
      ]),
      sourceId: null,
      sourceName: "Curated",
      sourceUrl: "",
      originalId: null,
      isVerified: true,
      aggregationScore: 100,
    },
    {
      id: "curated_3",
      title: "International Yoga Day Celebration",
      description:
        "Join thousands of yoga enthusiasts for a peaceful morning session at India Gate.",
      detailedDescription:
        "Celebrate International Yoga Day with a massive outdoor yoga session at the iconic India Gate. Led by renowned yoga masters, this free event includes guided meditation, breathing exercises, and various yoga styles suitable for all levels.",
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
      tags: JSON.stringify([
        "yoga",
        "wellness",
        "meditation",
        "health",
        "free",
      ]),
      sourceId: null,
      sourceName: "Curated",
      sourceUrl: "",
      originalId: null,
      isVerified: true,
      aggregationScore: 100,
    },
  ];

  for (const event of curatedEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
    console.log(`✅ Created/updated curated event: ${event.title}`);
  }

  // Create initial scraping log
  await prisma.scrapingLog.create({
    data: {
      source: "system",
      success: true,
      eventsFound: curatedEvents.length,
      eventsAdded: curatedEvents.length,
      eventsUpdated: 0,
      errors: JSON.stringify([]),
      duration: 0,
    },
  });

  console.log("✅ Database seeding completed!");
  console.log("📊 Summary:");
  console.log(`   - Event sources: ${sources.length}`);
  console.log(`   - Curated events: ${curatedEvents.length}`);
  console.log("🚀 Ready to start scraping!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
