export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  releaseDate: string;
  rating: number;
  posterUrl: string;
  trailerUrl?: string;
  cast?: string[];
  director?: string;
  isActive: boolean;
}

export interface Seat {
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

export interface Show {
  _id: string;
  movie: Movie | string;
  screen: string;
  showTime: string;
  language: string;
  totalSeats: number;
  availableSeats: number;
  seatMap: Seat[][];
  price: {
    regular: number;
    premium: number;
    vip: number;
  };
  isActive: boolean;
}

export interface SeatSelection {
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

export interface Booking {
  _id: string;
  user: User | string;
  show: Show | string;
  seats: SeatSelection[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  expiresAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

