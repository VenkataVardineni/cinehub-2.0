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
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  filters: {},
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
    setFilters: (state, action: PayloadAction<MovieState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const { setMovies, setSelectedMovie, setFilters } = movieSlice.actions;
export default movieSlice.reducer;

