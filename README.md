# EventSphere India - Event Discovery Platform

A web-based event discovery and booking platform for India, designed to help users find and book tickets for various events including concerts, workshops, conferences, and cultural programs.

**Live Demo:** [https://eventsphere-india.vercel.app/](https://eventsphere-india.vercel.app/)  
**Repository:** [https://github.com/Nihal018/eventsphere-india](https://github.com/Nihal018/eventsphere-india)

## Project Overview

EventSphere India is a web application that aggregates events from multiple trusted sources including Ticketmaster, AllEvents.in, and PredictHQ, providing users with a comprehensive platform for event discovery across India. Built as an alternative to platforms like BookMyShow and EventBrite, it offers real-time event discovery, seamless booking, and verified event sources all in one place.

## Features Implemented

### Core Functionality
- **Event Aggregation**: Pulls events from multiple sources (Ticketmaster, AllEvents.in, PredictHQ)
- **Real-Time Discovery**: Live updates of events happening across India
- **Event Listing**: Browse all available events with details
- **Event Categories**: Organized events by type (Music, Sports, Workshop, Theatre, etc.)
- **Event Details Page**: Comprehensive information about each event
- **Search Functionality**: Search events by name, venue, or keyword
- **Filter System**: Filter by date, category, location, and price range
- **Verified Sources**: All events from trusted platforms and verified organizers
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile browsers

### User Interface Components
- **Homepage**: Featured events and category navigation
- **Event Cards**: Visual display of event information
- **Navigation Bar**: Easy access to different sections
- **Footer**: Important links and information
- **Event Gallery**: Image carousel for event photos
- **Booking Interface**: Step-by-step booking process

### Booking System
- **Ticket Selection**: Choose ticket types and quantities
- **Price Calculation**: Dynamic pricing based on selection
- **Booking Form**: User details collection
- **Booking Summary**: Review before confirmation

## Tech Stack

### Frontend
- **Framework**: Modern JavaScript with React/Next.js
- **Styling**: Tailwind CSS / Modern CSS3
- **Deployment**: Vercel
- **API Integration**: RESTful APIs from multiple event sources

### Backend/APIs
- **Event Sources**: 
  - Ticketmaster API
  - AllEvents.in API
  - PredictHQ API
- **Data Aggregation**: Real-time event data fetching
- **Database**: For caching and user data (if implemented)

### Tools & Libraries
- **Font Awesome**: Icons
- **Google Fonts**: Typography
- **Image Optimization**: Compressed images for performance

## Project Structure

```
eventsphere-india/
├── index.html              # Homepage
├── css/
│   ├── style.css          # Main stylesheet
│   ├── responsive.css     # Media queries
│   └── components.css     # Component styles
├── js/
│   ├── main.js           # Core JavaScript
│   ├── events.js         # Event handling
│   └── booking.js        # Booking functionality
├── images/
│   ├── events/           # Event images
│   ├── logos/            # Brand assets
│   └── icons/            # UI icons
├── pages/
│   ├── events.html       # Events listing page
│   ├── event-details.html # Individual event page
│   ├── booking.html      # Booking page
│   └── about.html        # About page
└── assets/               # Additional resources
```

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Local web server (optional, for development)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nihal018/eventsphere-india.git
   cd eventsphere-india
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for better development experience

3. **Using Live Server (VS Code)**
   - Install Live Server extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"

4. **Using Python HTTP Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then navigate to `http://localhost:8000`

## Pages and Features

### 1. Homepage (`index.html`)
- Hero section with search bar
- Featured events carousel
- Event categories grid
- Upcoming events section
- Newsletter subscription

### 2. Events Page (`events.html`)
- Grid/List view toggle
- Filter sidebar
- Event cards with quick info
- Pagination for large event lists
- Sort options (date, price, popularity)

### 3. Event Details Page (`event-details.html`)
- Event banner image
- Detailed description
- Venue information
- Date and time
- Ticket pricing tiers
- Artist/speaker information
- Similar events recommendation

### 4. Booking Page (`booking.html`)
- Ticket type selection
- Quantity selector
- Customer information form
- Payment method selection
- Order summary
- Terms and conditions

## Current Implementation Status

### Completed ✅
- Static HTML pages structure
- CSS styling and responsive design
- Basic JavaScript interactions
- Event listing interface
- Event details display
- Booking form layout
- Mobile-responsive design

### In Progress 🔧
- Backend API integration
- Database connectivity
- Payment gateway integration
- User authentication
- Dynamic content loading

### Planned 📋
- User accounts and profiles
- Booking history
- Email notifications
- Admin panel
- Real-time seat selection

## Responsive Design

The website is fully responsive with breakpoints for:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px and above

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Optimized images for web
- Minified CSS and JavaScript files
- Lazy loading for images
- Efficient CSS selectors
- Reduced HTTP requests

## Code Standards

- Semantic HTML5 markup
- BEM methodology for CSS classes
- Modular JavaScript structure
- Consistent code formatting
- Comments for complex logic

## Future Enhancements

- User authentication system
- Payment gateway integration
- Real-time booking updates
- Email/SMS notifications
- Social media integration
- Review and rating system
- Multi-language support
- PWA features

## Contributing

Suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Testing

### Manual Testing Performed
- Cross-browser testing
- Responsive design testing
- Form validation testing
- Navigation flow testing
- Performance testing

## Known Issues

- Payment integration pending
- User authentication not implemented
- Static data (needs backend integration)

## Developer

**Nihal** - [GitHub](https://github.com/Nihal018)


## Acknowledgments

- Built as a project to demonstrate web development skills
- Inspired by BookMyShow and EventBrite
- Uses open-source libraries and frameworks

---

For any questions or suggestions, please open an issue on GitHub.
