import axios from 'axios';
import { Movie, Show, Booking, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  getAll: async (filters?: { genre?: string; language?: string; search?: string }) => {
    const response = await api.get<Movie[]>('/movies', { params: filters });
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

