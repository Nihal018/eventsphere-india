#!/bin/bash
# check-events.sh - Check what events are in your database

echo "🔍 Checking EventSphere Database Events..."
echo "=========================================="

# Check if dev server is running
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/events | grep -q "200"; then
    echo "❌ Dev server not running. Please run: npm run dev"
    exit 1
fi

echo "✅ Dev server is running"
echo ""

# Fetch events from API
echo "📊 Fetching events from database..."
EVENTS_RESPONSE=$(curl -s http://localhost:3000/api/events)

# Check if the response is successful
if echo "$EVENTS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ API is working"
    
    # Parse event count
    EVENTS_COUNT=$(echo "$EVENTS_RESPONSE" | jq '.data | length' 2>/dev/null)
    
    if [ "$EVENTS_COUNT" ] && [ "$EVENTS_COUNT" -gt 0 ]; then
        echo "📅 Found $EVENTS_COUNT events in database"
        echo ""
        
        # Show event titles and sources
        echo "📋 Event Breakdown:"
        echo "$EVENTS_RESPONSE" | jq -r '.data[] | "• \(.title) (\(.sourceName // "Curated"))"' 2>/dev/null | head -10
        
        if [ "$EVENTS_COUNT" -gt 10 ]; then
            echo "... and $((EVENTS_COUNT - 10)) more events"
        fi
        
        echo ""
        
        # Show events by source
        echo "🔌 Events by Source:"
        echo "$EVENTS_RESPONSE" | jq -r '.data | group_by(.sourceName // "Curated") | map({source: .[0].sourceName // "Curated", count: length}) | .[] | "• \(.source): \(.count) events"' 2>/dev/null
        
        echo ""
        
        # Show events by category
        echo "🎭 Events by Category:"
        echo "$EVENTS_RESPONSE" | jq -r '.data | group_by(.category) | map({category: .[0].category, count: length}) | .[] | "• \(.category): \(.count) events"' 2>/dev/null
        
        echo ""
        
        # Show cities
        echo "🏙️ Cities with Events:"
        echo "$EVENTS_RESPONSE" | jq -r '.data | map(.city) | unique | .[] | "• \(.)"' 2>/dev/null
        
        echo ""
        echo "🎯 Your /events page should show all $EVENTS_COUNT events!"
        
    else
        echo "❌ No events found in database"
        echo ""
        echo "💡 This is why you only see 9 events - they're from mock data!"
        echo ""
        echo "🚀 To fix this:"
        echo "1. Click 'Refresh Events' on homepage, or"
        echo "2. Run: curl -X POST http://localhost:3000/api/admin/scrape-events"
        echo "3. Wait for scraping to complete"
        echo "4. Refresh your /events page"
    fi
    
else
    echo "❌ API request failed"
    echo "Response: $EVENTS_RESPONSE"
    echo ""
    echo "💡 Check your API endpoint is working:"
    echo "curl http://localhost:3000/api/events"
fi

echo ""
echo "🔄 Testing scraping status..."
SCRAPING_STATUS=$(curl -s http://localhost:3000/api/admin/scrape-events)

if echo "$SCRAPING_STATUS" | grep -q '"success":true'; then
    echo "✅ Scraping API is working"
    
    # Show last run time
    LAST_RUN=$(echo "$SCRAPING_STATUS" | jq -r '.status.lastRun' 2>/dev/null)
    if [ "$LAST_RUN" != "null" ] && [ "$LAST_RUN" != "" ]; then
        echo "🕐 Last scraping run: $LAST_RUN"
    else
        echo "⚠️ No scraping runs yet"
    fi
    
    # Show total events in database
    TOTAL_EVENTS=$(echo "$SCRAPING_STATUS" | jq -r '.status.totalEventsInDatabase' 2>/dev/null)
    if [ "$TOTAL_EVENTS" ] && [ "$TOTAL_EVENTS" -gt 0 ]; then
        echo "📊 Total events in database: $TOTAL_EVENTS"
    fi
else
    echo "❌ Scraping API not working"
fi

echo ""
echo "🎯 Summary:"
echo "==========="

if [ "$EVENTS_COUNT" ] && [ "$EVENTS_COUNT" -gt 9 ]; then
    echo "✅ You have $EVENTS_COUNT real events in database"
    echo "✅ Replace your /events page with the updated version"
    echo "✅ Your /events page will show real data instead of 9 mock events"
elif [ "$EVENTS_COUNT" ] && [ "$EVENTS_COUNT" -gt 0 ] && [ "$EVENTS_COUNT" -le 9 ]; then
    echo "⚠️ You have $EVENTS_COUNT events (similar to mock data count)"
    echo "🚀 Run scraping to get more events: curl -X POST http://localhost:3000/api/admin/scrape-events"
    echo "✅ Then replace your /events page with the updated version"
else
    echo "❌ No real events in database - still using mock data"
    echo "🚀 FIRST: Run scraping to load real events"
    echo "🚀 THEN: Replace your /events page with the updated version"
fi

echo ""
echo "📝 Quick Fix Commands:"
echo "curl -X POST http://localhost:3000/api/admin/scrape-events  # Load real events"
echo "# Replace app/events/page.tsx with updated version"
echo "# Refresh /events page in browser"