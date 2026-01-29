# CineHub 2.0 Architecture

## Overview

CineHub 2.0 is a full-stack movie booking platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. The application enables users to browse movies, view showtimes, select seats, and make bookings, while admins can manage movies and shows.

## System Architecture

```
┌─────────────┐
│   React     │  Frontend (Port 3000)
│   Frontend  │
└──────┬──────┘
       │ HTTP/REST API
┌──────▼──────┐
│   Express   │  Backend API (Port 5000)
│   Backend   │
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB    │  Database (Port 27017)
└─────────────┘
```

## User Flow

### 1. Browse Movies
- User lands on the homepage showing all available movies
- Movies are displayed as cards with poster, title, genre, language, duration, and rating
- Users can filter movies by:
  - Search term (title/description)
  - Language (English, Hindi, Telugu, Tamil, etc.)
  - Genre (Action, Comedy, Drama, Thriller, etc.)

### 2. View Movie Details
- Clicking on a movie card navigates to the movie detail page
- Displays:
  - Movie poster
  - Title, description, genre, language, duration
  - Release date, rating, director, cast
  - List of upcoming shows for the selected date

### 3. Select Showtime
- User selects a date to view available shows
- Shows are displayed as cards showing:
  - Show time
  - Screen number
  - Language
  - Available seats count
- Clicking a show navigates to the booking page

### 4. Choose Seats
- Interactive seat grid displays all available seats
- Seats are color-coded:
  - Green: Available (Regular)
  - Yellow: Available (Premium)
  - Red: Available (VIP)
  - Blue: Selected by user
  - Dark Red: Occupied/Booked
- User clicks on seats to select/deselect
- Selected seats are highlighted and shown in the booking summary

### 5. Enter User Details
- User enters:
  - Name
  - Email
  - Phone number
- User information is created/stored in the database

### 6. Confirm Booking
- Booking summary shows:
  - Selected seats
  - Number of seats
  - Total amount
- User confirms booking
- Booking is created with status "pending"
- Seat lock mechanism prevents double booking
- Booking expires after 15 minutes if not confirmed

## Admin Flow

### 1. Manage Movies
- Add new movies with details (title, description, genre, language, etc.)
- Edit existing movies
- Deactivate movies (set isActive to false)

### 2. Manage Shows
- Create shows for movies with:
  - Screen number
  - Show time
  - Language
  - Seat map configuration
  - Pricing (regular, premium, VIP)
- Edit or cancel shows
- View booking statistics

## Data Models

### Movie
```typescript
{
  title: string
  description: string
  genre: string[]
  language: string
  duration: number (minutes)
  releaseDate: Date
  rating: number (0-10)
  posterUrl: string
  trailerUrl?: string
  cast?: string[]
  director?: string
  isActive: boolean
}
```

### Show
```typescript
{
  movie: ObjectId (ref: Movie)
  screen: string
  showTime: Date
  language: string
  totalSeats: number
  availableSeats: number
  seatMap: Seat[][]
  price: {
    regular: number
    premium: number
    vip: number
  }
  isActive: boolean
}
```

### Seat
```typescript
{
  row: string (e.g., "A", "B")
  number: number
  type: "regular" | "premium" | "vip"
  price: number
}
```

### Booking
```typescript
{
  user: ObjectId (ref: User)
  show: ObjectId (ref: Show)
  seats: SeatSelection[]
  totalAmount: number
  status: "pending" | "confirmed" | "cancelled"
  bookingDate: Date
  expiresAt: Date (15 minutes from creation)
}
```

### User
```typescript
{
  name: string
  email: string (unique)
  phone: string
  role: "user" | "admin"
}
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with optional filters)
- `GET /api/movies/:id` - Get movie by ID

### Shows
- `GET /api/shows/movie/:movieId` - Get shows for a movie (with optional date filter)
- `GET /api/shows/:id` - Get show by ID

### Bookings
- `POST /api/bookings` - Create a new booking
  - Body: `{ userId, showId, seats: [{ row, number, type, price }] }`
- `GET /api/bookings/:id` - Get booking by ID

### Users
- `POST /api/users` - Create a new user
  - Body: `{ name, email, phone, role? }`
- `GET /api/users/:id` - Get user by ID

## Seat Lock Mechanism

1. When a user selects seats and creates a booking, the seats are locked
2. The booking has a status of "pending" and expires after 15 minutes
3. During this time, other users cannot book the same seats
4. The system checks for existing bookings (pending or confirmed) before allowing new bookings
5. Expired bookings are automatically cleaned up (MongoDB TTL index)

## State Management (Frontend)

### Redux Store Structure
```typescript
{
  booking: {
    selectedShow: Show | null
    selectedSeats: SeatSelection[]
    totalAmount: number
  },
  movies: {
    movies: Movie[]
    selectedMovie: Movie | null
    filters: {
      genre?: string
      language?: string
      search?: string
    }
  }
}
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB (containerized)

## Security Considerations

1. **Input Validation**: All API endpoints validate input using express-validator
2. **Seat Locking**: Prevents double booking through database checks
3. **CORS**: Configured for frontend-backend communication
4. **Environment Variables**: Sensitive data stored in .env files

## Future Enhancements

1. **Authentication & Authorization**: JWT-based auth for users and admins
2. **Payment Integration**: Payment gateway integration for booking confirmation
3. **Email Notifications**: Send booking confirmations via email
4. **Real-time Updates**: WebSocket for real-time seat availability
5. **Admin Dashboard**: Full admin interface for managing movies and shows
6. **Booking History**: User dashboard to view booking history
7. **Reviews & Ratings**: User reviews and ratings for movies
8. **Recommendations**: Movie recommendations based on user preferences

