import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types';

interface MovieState {
  movies: Movie[];
  selectedMovie: Movie | null;
  filters: {
    genre?: string;
    language?: string;
    search?: string;
  };
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  filters: {},
  page: 1,
  totalPages: 1,
  total: 0,
  limit: 12,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
    setMoviePage: (
      state,
      action: PayloadAction<{
        movies: Movie[];
        page: number;
        totalPages: number;
        total: number;
        limit: number;
      }>
    ) => {
      state.movies = action.payload.movies;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
      state.limit = action.payload.limit;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
    setFilters: (state, action: PayloadAction<MovieState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const { setMovies, setMoviePage, setPage, setSelectedMovie, setFilters } =
  movieSlice.actions;
export default movieSlice.reducer;

