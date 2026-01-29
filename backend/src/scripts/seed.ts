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
        posterUrl: 'https://picsum.photos/300/450?random=1',
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
        posterUrl: 'https://picsum.photos/300/450?random=2',
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
        posterUrl: 'https://picsum.photos/300/450?random=3',
        director: 'S.S. Rajamouli',
        cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'],
        isActive: true,
      },
      {
        title: 'The Hangover',
        description:
          'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the groom missing. They must retrace their steps to find their friend before the wedding.',
        genre: ['Comedy'],
        language: 'English',
        duration: 100,
        releaseDate: new Date('2009-06-05'),
        rating: 7.7,
        posterUrl: 'https://picsum.photos/300/450?random=4',
        director: 'Todd Phillips',
        cast: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
        isActive: true,
      },
      {
        title: 'The Conjuring',
        description:
          'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
        genre: ['Horror', 'Thriller'],
        language: 'English',
        duration: 112,
        releaseDate: new Date('2013-07-19'),
        rating: 7.5,
        posterUrl: 'https://picsum.photos/300/450?random=5',
        director: 'James Wan',
        cast: ['Patrick Wilson', 'Vera Farmiga', 'Ron Livingston'],
        isActive: true,
      },
      {
        title: 'La La Land',
        description:
          'A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles.',
        genre: ['Romance', 'Musical', 'Drama'],
        language: 'English',
        duration: 128,
        releaseDate: new Date('2016-12-25'),
        rating: 8.0,
        posterUrl: 'https://picsum.photos/300/450?random=6',
        director: 'Damien Chazelle',
        cast: ['Ryan Gosling', 'Emma Stone', 'John Legend'],
        isActive: true,
      },
      {
        title: 'The Matrix',
        description:
          'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: ['Action', 'Sci-Fi'],
        language: 'English',
        duration: 136,
        releaseDate: new Date('1999-03-31'),
        rating: 8.7,
        posterUrl: 'https://picsum.photos/300/450?random=7',
        director: 'Lana Wachowski',
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        isActive: true,
      },
      {
        title: '3 Idiots',
        description:
          'In the tradition of "Educating Rita" and "Good Will Hunting," this film follows three engineering students who form a deep bond in college.',
        genre: ['Comedy', 'Drama'],
        language: 'Hindi',
        duration: 170,
        releaseDate: new Date('2009-12-25'),
        rating: 8.4,
        posterUrl: 'https://picsum.photos/300/450?random=8',
        director: 'Rajkumar Hirani',
        cast: ['Aamir Khan', 'Madhavan', 'Sharman Joshi'],
        isActive: true,
      },
      {
        title: 'Interstellar',
        description:
          'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        rating: 8.6,
        posterUrl: 'https://picsum.photos/300/450?random=9',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        isActive: true,
      },
      {
        title: 'The Notebook',
        description:
          'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
        genre: ['Romance', 'Drama'],
        language: 'English',
        duration: 123,
        releaseDate: new Date('2004-06-25'),
        rating: 7.8,
        posterUrl: 'https://picsum.photos/300/450?random=10',
        director: 'Nick Cassavetes',
        cast: ['Ryan Gosling', 'Rachel McAdams', 'James Garner'],
        isActive: true,
      },
      {
        title: 'Get Out',
        description:
          'A young African-American visits his white girlfriend\'s parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.',
        genre: ['Horror', 'Thriller', 'Mystery'],
        language: 'English',
        duration: 104,
        releaseDate: new Date('2017-02-24'),
        rating: 7.8,
        posterUrl: 'https://picsum.photos/300/450?random=11',
        director: 'Jordan Peele',
        cast: ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford'],
        isActive: true,
      },
      {
        title: 'Dilwale Dulhania Le Jayenge',
        description:
          'Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values.',
        genre: ['Romance', 'Comedy', 'Drama'],
        language: 'Hindi',
        duration: 189,
        releaseDate: new Date('1995-10-20'),
        rating: 8.1,
        posterUrl: 'https://picsum.photos/300/450?random=12',
        director: 'Aditya Chopra',
        cast: ['Shah Rukh Khan', 'Kajol', 'Amrish Puri'],
        isActive: true,
      },
      {
        title: 'The Avengers',
        description:
          'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 143,
        releaseDate: new Date('2012-05-04'),
        rating: 8.0,
        posterUrl: 'https://picsum.photos/300/450?random=13',
        director: 'Joss Whedon',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
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

