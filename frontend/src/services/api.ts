import axios from 'axios';
import { Movie, Show, Booking, User, PaginatedMovies } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  getAll: async (filters?: {
    genre?: string;
    language?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedMovies>('/movies', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },
};

export const showApi = {
  getByMovieId: async (movieId: string, date?: string) => {
    const response = await api.get<Show[]>(`/shows/movie/${movieId}`, {
      params: date ? { date } : {},
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Show>(`/shows/${id}`);
    return response.data;
  },
  getBookedSeats: async (showId: string) => {
    const response = await api.get<{ bookedSeats: string[] }>(`/shows/${showId}/booked-seats`);
    return response.data;
  },
};

export const bookingApi = {
  create: async (bookingData: {
    userId: string;
    showId: string;
    seats: Array<{ row: string; number: number; type: string; price: number }>;
  }) => {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
  getMine: async () => {
    const response = await api.get<Booking[]>('/bookings/me');
    return response.data;
  },
};

export const authApi = {
  login: async (body: { email: string; password: string }) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', body);
    return response.data;
  },
  register: async (body: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', body);
    return response.data;
  },
  me: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export const userApi = {
  create: async (userData: { name: string; email: string; phone: string; role?: string }) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

export default api;

