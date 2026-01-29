# CineHub 2.0

An advanced online movie booking platform built with MERN stack and TypeScript.

## Features

### User Flow
1. **Browse Movies**: View available movies with filters (genre, language, etc.)
2. **View Details**: See movie details including synopsis, cast, ratings, and trailers
3. **Pick Show**: Select from available showtimes for a movie
4. **Choose Seats**: Interactive seat grid to select preferred seats
5. **Confirm Booking**: Review and confirm booking (payment integration ready)

### Admin Flow
1. **Manage Movies**: Add, edit, and remove movies
2. **Manage Shows**: Create and manage showtimes for movies
3. **View Bookings**: Monitor bookings and seat availability

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend**: React, TypeScript, Redux Toolkit (RTK)
- **Infrastructure**: Docker, Docker Compose
- **Database**: MongoDB

## Project Structure

```
cinehub-2.0/
├── backend/          # Express API server
├── frontend/         # React application
├── infra/            # Docker and infrastructure configs
└── docs/             # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and other configurations.

5. (Optional) Seed the database with sample data:
```bash
npm run seed
```

6. Start MongoDB using Docker:
```bash
cd ../infra
docker-compose up -d mongodb
```

7. Start the backend server:
```bash
cd ../backend
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Using Docker Compose (Full Stack)

1. Navigate to infra directory:
```bash
cd infra
```

2. Start all services:
```bash
docker-compose up -d
```

This will start MongoDB and the backend service.

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get movie details

### Shows
- `GET /api/shows/movie/:movieId` - Get shows for a specific movie
- `GET /api/shows/:id` - Get show details

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details

### Users
- `POST /api/users` - Create user account
- `GET /api/users/:id` - Get user details

## Development

### Backend
- Development: `npm run dev`
- Build: `npm run build`
- Production: `npm start`

### Frontend
- Development: `npm start`
- Build: `npm run build`

## License

MIT

