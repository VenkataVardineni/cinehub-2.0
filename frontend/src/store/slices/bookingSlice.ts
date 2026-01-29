import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Show, SeatSelection } from '../../types';

interface BookingState {
  selectedShow: Show | null;
  selectedSeats: SeatSelection[];
  totalAmount: number;
}

const initialState: BookingState = {
  selectedShow: null,
  selectedSeats: [],
  totalAmount: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedShow: (state, action: PayloadAction<Show>) => {
      state.selectedShow = action.payload;
      state.selectedSeats = [];
      state.totalAmount = 0;
    },
    toggleSeat: (state, action: PayloadAction<SeatSelection>) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex(
        (s) => s.row === seat.row && s.number === seat.number
      );

      if (index >= 0) {
        state.selectedSeats.splice(index, 1);
      } else {
        state.selectedSeats.push(seat);
      }

      state.totalAmount = state.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    },
    clearBooking: (state) => {
      state.selectedShow = null;
      state.selectedSeats = [];
      state.totalAmount = 0;
    },
  },
});

export const { setSelectedShow, toggleSeat, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

