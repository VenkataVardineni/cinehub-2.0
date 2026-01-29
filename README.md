# CineHub 2.0

An advanced online movie booking platform built with MERN stack and TypeScript. CineHub 2.0 provides a seamless experience for users to browse movies, view showtimes, select seats, and make bookings, while admins can manage movies and shows.

## 🎬 Features

### User Features

#### Movie Browsing
- **Movie List**: Browse all available movies with beautiful card-based layout
- **Search Functionality**: Real-time search with debouncing (500ms delay)
- **Advanced Filters**: Filter movies by:
  - Genre (Action, Comedy, Drama, Horror, Romance, Sci-Fi, Thriller, etc.)
  - Language (English, Hindi, Telugu, Tamil, etc.)
  - Search by title or description
- **Movie Details**: Comprehensive movie information including:
  - Synopsis and description
  - Genre, language, duration
  - Release date and ratings
  - Director and cast information
  - Movie poster with fallback images

#### Show Selection
- **Showtime Display**: View all available shows for a selected movie
- **Date Selection**: Choose from available dates (next 7 days)
- **Show Information**: See screen number, show time, language, and available seats
- **Multiple Shows**: Multiple showtimes per day across different screens

#### Seat Selection & Booking
- **Interactive Seat Grid**: Visual seat map with color-coded seat types:
  - 🟢 Regular seats (Green)
  - 🟡 Premium seats (Yellow)
  - 🔴 VIP seats (Red)
- **Real-time Availability**: Booked seats are marked as unavailable (red) and cannot be selected
- **Seat Selection**: Click to select/deselect seats with visual feedback
- **Booking Summary**: View selected seats, count, and total amount before confirmation
- **User Information**: Enter name, email, and phone (existing users can book multiple times)
- **Booking Confirmation**: Beautiful confirmation page with:
  - Booking ID and status
  - Movie and show details
  - Selected seats information
  - User information
  - Total amount
  - Print ticket option

### Admin Features (API Ready)
- **Movie Management**: Add, edit, and manage movies
- **Show Management**: Create and manage showtimes
- **Booking Monitoring**: View all bookings and seat availability

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit (RTK)** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **MongoDB** - NoSQL database

### Development Tools
- **Nodemon** - Auto-restart for development
- **ts-node** - TypeScript execution
- **Create React App** - React scaffolding

## 📋 Key Functionalities

### 1. Movie Management
- Display movies with posters, ratings, and metadata
- Search and filter movies dynamically
- View detailed movie information
- Support for multiple genres and languages

### 2. Show Management
- Create shows for movies with:
  - Screen assignment
  - Show time scheduling
  - Language selection
  - Seat map configuration
  - Pricing tiers (Regular, Premium, VIP)

### 3. Seat Booking System
- **Seat Map Generation**: Dynamic seat grid with rows and columns
- **Seat Types**: Three pricing tiers (Regular, Premium, VIP)
- **Availability Tracking**: Real-time seat availability checking
- **Double Booking Prevention**: Server-side validation prevents seat conflicts
- **Seat Locking**: Booked seats are immediately marked as unavailable

### 4. User Management
- **Flexible User Creation**: Users can book with same email multiple times
- **User Retrieval**: Existing users are automatically retrieved
- **User Information Update**: Name and phone can be updated on subsequent bookings

### 5. Booking System
- **Instant Confirmation**: Bookings are confirmed immediately (status: 'confirmed')
- **Booking Tracking**: Unique booking ID for each transaction
- **Booking History**: All bookings stored with full details
- **Expiration Handling**: Pending bookings expire after 15 minutes (future enhancement)

### 6. Real-time Features
- **Live Seat Availability**: Fetches booked seats from API
- **Debounced Search**: Optimized search with 500ms debounce
- **Responsive UI**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/VenkataVardineni/cinehub-2.0.git
   cd cinehub-2.0
   ```

2. **Start MongoDB**
   ```bash
   cd infra
   docker-compose up -d mongodb
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run seed  # Optional: Add sample data
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
cinehub-2.0/
├── backend/              # Express API server
│   ├── src/
│   │   ├── models/      # Mongoose models (Movie, Show, Booking, User)
│   │   ├── routes/      # API routes (movies, shows, bookings, users)
│   │   ├── scripts/     # Database seeding script
│   │   └── server.ts   # Express server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/       # React pages (MovieList, MovieDetail, Booking, BookingConfirmation)
│   │   ├── store/       # Redux store and slices
│   │   ├── services/    # API service layer
│   │   ├── types/       # TypeScript type definitions
│   │   └── App.tsx      # Main app component
│   └── package.json
├── infra/               # Docker configurations
│   └── docker-compose.yml
├── docs/                # Documentation
│   └── architecture.md  # System architecture documentation
├── README.md
└── SETUP.md
```

## 🔌 API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with optional filters: genre, language, search)
- `GET /api/movies/:id` - Get movie by ID

### Shows
- `GET /api/shows/movie/:movieId` - Get shows for a specific movie (with optional date filter)
- `GET /api/shows/:id` - Get show by ID
- `GET /api/shows/:id/booked-seats` - Get booked seats for a show

### Bookings
- `POST /api/bookings` - Create a new booking
  - Body: `{ userId, showId, seats: [{ row, number, type, price }] }`
- `GET /api/bookings/:id` - Get booking by ID

### Users
- `POST /api/users` - Create or retrieve user by email
  - Body: `{ name, email, phone, role? }`
  - Returns existing user if email exists (allows multiple bookings)
- `GET /api/users/:id` - Get user by ID

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Color-coded Seats**: Visual distinction between seat types
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Search Debouncing**: Optimized search performance
- **Image Fallbacks**: Automatic fallback for missing movie posters
- **Print Support**: Print-friendly booking confirmation page

## 🗄️ Database Schema

### Movie
- Title, description, genre, language
- Duration, release date, rating
- Poster URL, trailer URL
- Director, cast information
- Active status

### Show
- Movie reference
- Screen number, show time
- Language, seat map
- Pricing tiers (regular, premium, VIP)
- Available seats count

### Booking
- User reference
- Show reference
- Selected seats array
- Total amount
- Status (pending, confirmed, cancelled)
- Expiration time

### User
- Name, email (unique), phone
- Role (user, admin)

## 🔒 Security Features

- **Input Validation**: Server-side validation using express-validator
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Seat Conflict Prevention**: Server-side checks prevent double booking
- **Type Safety**: Full TypeScript implementation

## 🚧 Future Enhancements

- [ ] User authentication and authorization (JWT)
- [ ] Payment gateway integration
- [ ] Email notifications for bookings
- [ ] Real-time seat updates using WebSockets
- [ ] Admin dashboard UI
- [ ] User booking history page
- [ ] Movie reviews and ratings
- [ ] Recommendation system
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev    # Development with hot reload
npm run build  # Build for production
npm start      # Production server
npm run seed   # Seed database
```

### Frontend Development
```bash
cd frontend
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For architecture details, see [docs/architecture.md](./docs/architecture.md)

## 🎯 Project Status

✅ **Completed Features:**
- Movie browsing with search and filters
- Show selection and scheduling
- Interactive seat selection
- Booking system with confirmation
- User management
- Real-time seat availability
- Booking confirmation page
- Database seeding
- Docker setup

🔄 **In Progress:**
- Admin dashboard UI
- Payment integration

📋 **Planned:**
- Authentication system
- Email notifications
- WebSocket for real-time updates

---

**Built with ❤️ using MERN Stack + TypeScript**
