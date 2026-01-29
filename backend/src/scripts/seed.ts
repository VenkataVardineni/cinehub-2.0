import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie';
import Show from '../models/Show';
import User from '../models/User';
import { ISeat } from '../models/Show';

dotenv.config();

const generateSeatMap = (rows: number, seatsPerRow: number): ISeat[][] => {
  const seatMap: ISeat[][] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const prices = { regular: 200, premium: 300, vip: 500 };

  for (let i = 0; i < rows; i++) {
    const row: ISeat[] = [];
    const rowLabel = rowLabels[i];
    let seatType: 'regular' | 'premium' | 'vip' = 'regular';

    if (i >= rows - 2) {
      seatType = 'vip';
    } else if (i >= rows - 4) {
      seatType = 'premium';
    }

    for (let j = 1; j <= seatsPerRow; j++) {
      row.push({
        row: rowLabel,
        number: j,
        type: seatType,
        price: prices[seatType],
      });
    }
    seatMap.push(row);
  }

  return seatMap;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinehub');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await User.deleteMany({});

    // Create sample movies
    const movies = [
      {
        title: 'The Dark Knight',
        description:
          'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        rating: 9.0,
        posterUrl: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        isActive: true,
      },
      {
        title: 'Inception',
        description:
          'A skilled thief is given a chance at redemption if he can pull off an impossible task: Inception, planting an idea in someone\'s mind.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        posterUrl: 'https://via.placeholder.com/300x450?text=Inception',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
        isActive: true,
      },
      {
        title: 'Baahubali 2: The Conclusion',
        description:
          'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
        genre: ['Action', 'Drama'],
        language: 'Telugu',
        duration: 167,
        releaseDate: new Date('2017-04-28'),
        rating: 8.2,
        posterUrl: 'https://via.placeholder.com/300x450?text=Baahubali+2',
        director: 'S.S. Rajamouli',
        cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'],
        isActive: true,
      },
    ];

    const createdMovies = await Movie.insertMany(movies);
    console.log(`Created ${createdMovies.length} movies`);

    // Create sample shows
    const shows = [];
    const seatMap = generateSeatMap(8, 12); // 8 rows, 12 seats per row
    const totalSeats = seatMap.reduce((sum, row) => sum + row.length, 0);

    for (const movie of createdMovies) {
      const today = new Date();
      for (let day = 0; day < 7; day++) {
        const showDate = new Date(today);
        showDate.setDate(today.getDate() + day);
        showDate.setHours(10, 0, 0, 0); // 10 AM

        shows.push({
          movie: movie._id,
          screen: 'Screen 1',
          showTime: new Date(showDate),
          language: movie.language,
          totalSeats,
          availableSeats: totalSeats,
          seatMap,
          price: {
            regular: 200,
            premium: 300,
            vip: 500,
          },
          isActive: true,
        });

        showDate.setHours(14, 0, 0, 0); // 2 PM
        shows.push({
          movie: movie._id,
          screen: 'Screen 2',
          showTime: new Date(showDate),
          language: movie.language,
          totalSeats,
          availableSeats: totalSeats,
          seatMap,
          price: {
            regular: 200,
            premium: 300,
            vip: 500,
          },
          isActive: true,
        });

        showDate.setHours(18, 0, 0, 0); // 6 PM
        shows.push({
          movie: movie._id,
          screen: 'Screen 1',
          showTime: new Date(showDate),
          language: movie.language,
          totalSeats,
          availableSeats: totalSeats,
          seatMap,
          price: {
            regular: 200,
            premium: 300,
            vip: 500,
          },
          isActive: true,
        });
      }
    }

    await Show.insertMany(shows);
    console.log(`Created ${shows.length} shows`);

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'user',
    });
    console.log(`Created user: ${user.email}`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

