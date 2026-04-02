import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import movieReducer from './slices/movieSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    movies: movieReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

