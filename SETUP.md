# CineHub 2.0 Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/VenkataVardineni/cinehub-2.0.git
cd cinehub-2.0
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration (optional, defaults work for local development)
# PORT=5001
# MONGODB_URI=mongodb://localhost:27017/cinehub
# NODE_ENV=development
# JWT_SECRET=your-secret-key-here
```

### 3. Database Setup

Start MongoDB using Docker:

```bash
# From project root
cd infra
docker-compose up -d mongodb
```

Or start MongoDB and backend together:

```bash
cd infra
docker-compose up -d
```

### 4. Seed the Database (Optional)

Populate the database with sample movies and shows:

```bash
cd backend
npm run seed
```

This will create:
- 13 sample movies with various genres
- Multiple shows for each movie
- 1 sample user account

### 5. Start Backend Server

```bash
# From backend directory
npm run dev
```

The backend API will be available at `http://localhost:5001`

### 6. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Edit .env if needed (defaults work for local development)
# REACT_APP_API_URL=http://localhost:5001/api
```

### 7. Start Frontend Development Server

```bash
# From frontend directory
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## Development Commands

### Backend

```bash
cd backend

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed
```

### Frontend

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Using Docker Compose (Full Stack)

To run both MongoDB and backend together:

```bash
cd infra
docker-compose up -d
```

To stop:

```bash
cd infra
docker-compose down
```

## Environment Variables

### Backend (.env)

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/cinehub
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Project Structure

```
cinehub-2.0/
├── backend/              # Express API server
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── scripts/    # Utility scripts (seed)
│   │   └── server.ts    # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/       # React pages/components
│   │   ├── store/       # Redux store and slices
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── package.json
├── infra/               # Docker configurations
│   └── docker-compose.yml
├── docs/                # Documentation
│   └── architecture.md
├── README.md
└── SETUP.md
```

## Troubleshooting

### Port Already in Use

If port 5001 is already in use, you can change it in `backend/.env`:

```env
PORT=5002
```

And update `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5002/api
```

### MongoDB Connection Issues

Ensure MongoDB is running:

```bash
docker ps | grep mongodb
```

If not running, start it:

```bash
cd infra
docker-compose up -d mongodb
```

### CORS Errors

Ensure the backend is running and the frontend API URL matches the backend port.

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/build/` directory.

## Next Steps

1. Explore the application at `http://localhost:3000`
2. Browse movies, select shows, and make bookings
3. Check the API documentation in `docs/architecture.md`
4. Customize the application for your needs

## Support

For issues or questions, please check:
- `docs/architecture.md` for system architecture
- `README.md` for feature overview
- GitHub Issues for known problems

