// scripts/debug-scraping.js
// Run this with: node scripts/debug-scraping.js

require("dotenv").config();

async function debugScraping() {
  console.log("🔍 Debugging EventSphere Scraping Setup...\n");

  // Check 1: Environment Variables
  console.log("1️⃣ Environment Variables:");
  console.log(
    "   DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "   EVENTBRITE_API_KEY:",
    process.env.EVENTBRITE_API_KEY ? "✅ Set" : "❌ Missing"
  );

  if (process.env.EVENTBRITE_API_KEY) {
    console.log(
      "   API Key Preview:",
      process.env.EVENTBRITE_API_KEY.substring(0, 10) + "..."
    );
  }
  console.log();

  // Check 2: Database Connection
  console.log("2️⃣ Database Connection:");
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.$connect();
    console.log("   ✅ Database connected successfully");

    // Check if tables exist
    try {
      const eventCount = await prisma.event.count();
      console.log(`   ✅ Events table exists with ${eventCount} records`);

      const sourceCount = await prisma.eventSource.count();
      console.log(`   ✅ EventSource table exists with ${sourceCount} records`);

      const logCount = await prisma.scrapingLog.count();
      console.log(`   ✅ ScrapingLog table exists with ${logCount} records`);
    } catch (tableError) {
      console.log("   ❌ Database tables not found. Run: npx prisma db push");
    }

    await prisma.$disconnect();
  } catch (dbError) {
    console.log("   ❌ Database connection failed:", dbError.message);
    console.log("   💡 Try running: npx prisma generate && npx prisma db push");
  }
  console.log();

  // Check 3: Eventbrite API
  if (process.env.EVENTBRITE_API_KEY) {
    console.log("3️⃣ Eventbrite API Test:");
    try {
      const fetch = require("node-fetch");

      const response = await fetch(
        "https://www.eventbriteapi.com/v3/users/me/",
        {
          headers: {
            Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("   ✅ API key is valid");
        console.log("   👤 User:", userData.name || "No name provided");
      } else {
        console.log("   ❌ API key validation failed:", response.status);
        const errorText = await response.text();
        console.log("   📝 Error:", errorText.substring(0, 200));
      }
    } catch (apiError) {
      console.log("   ❌ API test failed:", apiError.message);
    }
  } else {
    console.log("3️⃣ Eventbrite API Test: ⏭️ Skipped (no API key)");
  }
  console.log();

  // Check 4: File Structure
  console.log("4️⃣ File Structure Check:");
  const fs = require("fs");
  const path = require("path");

  const requiredFiles = [
    "prisma/schema.prisma",
    "app/api/admin/scrape-events/route.ts",
    "lib/database.ts",
    "lib/scrapers/realScraperService.ts",
  ];

  requiredFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${filePath}`);
    } else {
      console.log(`   ❌ ${filePath} - Missing!`);
    }
  });
  console.log();

  // Check 5: Next.js API Route Test
  console.log("5️⃣ Testing API Route:");
  try {
    const fetch = require("node-fetch");

    // Test GET first (status endpoint)
    const statusResponse = await fetch(
      "http://localhost:3000/api/admin/scrape-events"
    );

    if (statusResponse.ok) {
      console.log("   ✅ API route is accessible");
      const statusData = await statusResponse.json();

      if (statusData.success) {
        console.log("   ✅ Status endpoint working");
        console.log(
          `   📊 Events in DB: ${statusData.status.totalEventsInDatabase}`
        );
      } else {
        console.log("   ⚠️ Status endpoint returned error:", statusData.error);
      }
    } else {
      console.log(
        "   ❌ API route not accessible. Is your dev server running?"
      );
      console.log("   💡 Run: npm run dev");
    }
  } catch (routeError) {
    console.log("   ❌ API route test failed:", routeError.message);
    console.log(
      "   💡 Make sure your Next.js dev server is running: npm run dev"
    );
  }
  console.log();

  // Summary
  console.log("🎯 Next Steps:");
  console.log("   1. Fix any ❌ issues above");
  console.log("   2. Run: npm run dev");
  console.log("   3. Visit: http://localhost:3000/admin/scraping");
  console.log('   4. Click "Start Scraping" and watch the logs');
  console.log(
    "   5. If still no real scraping, check browser console for errors"
  );
}

debugScraping().catch(console.error);
