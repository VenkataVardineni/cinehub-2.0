import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showApi, bookingApi, userApi } from '../services/api';
import { setSelectedShow, toggleSeat, clearBooking } from '../store/slices/bookingSlice';
import { Show, Seat, SeatSelection, User } from '../types';
import './Booking.css';

const Booking: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedShow, selectedSeats, totalAmount } = useAppSelector((state) => state.booking);
  const [show, setShow] = useState<Show | null>(null);
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showId) {
      loadShow();
    }
    return () => {
      dispatch(clearBooking());
    };
  }, [showId]);

  useEffect(() => {
    if (selectedShow) {
      setShow(selectedShow);
    }
  }, [selectedShow]);

  useEffect(() => {
    if (show) {
      loadBookedSeats();
    }
  }, [show, showId]);

  const loadShow = async () => {
    try {
      setLoading(true);
      const data = await showApi.getById(showId!);
      setShow(data);
      dispatch(setSelectedShow(data));
    } catch (err: any) {
      setError(err.message || 'Failed to load show');
    } finally {
      setLoading(false);
    }
  };

  const loadBookedSeats = async () => {
    if (!showId) return;
    try {
      const data = await showApi.getBookedSeats(showId);
      setBookedSeats(new Set(data.bookedSeats));
    } catch (err) {
      console.error('Failed to load booked seats:', err);
      setBookedSeats(new Set());
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (isSeatOccupied(seat)) {
      return;
    }

    const seatSelection: SeatSelection = {
      row: seat.row,
      number: seat.number,
      type: seat.type,
      price: seat.price,
    };

    dispatch(toggleSeat(seatSelection));
  };

  const isSeatOccupied = (seat: Seat): boolean => {
    const seatKey = `${seat.row}-${seat.number}`;
    return bookedSeats.has(seatKey);
  };

  const isSeatSelected = (seat: Seat): boolean => {
    return selectedSeats.some((s) => s.row === seat.row && s.number === seat.number);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      // This will create a new user or return existing user if email exists
      const userData = await userApi.create(userForm);
      setUser(userData);
      // After user is created/retrieved, proceed to booking if seats are selected
      if (selectedSeats.length > 0 && show) {
        await handleBookingSubmit(userData);
      }
    } catch (err: any) {
      let errorMessage = 'Failed to process user information';
      if (err.response?.data) {
        if (err.response.data.errors) {
          // Validation errors
          errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
        } else if (err.response.data.error) {
          // Single error message
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  const handleBookingSubmit = async (userToUse?: User) => {
    const currentUser = userToUse || user;
    if (!currentUser || selectedSeats.length === 0 || !show) {
      if (!currentUser) {
        setError('Please enter your details first');
      } else {
        setError('Please select seats');
      }
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const booking = await bookingApi.create({
        userId: currentUser._id,
        showId: show._id,
        seats: selectedSeats,
      });

      // Navigate to confirmation page with booking ID
      dispatch(clearBooking());
      navigate(`/booking-confirmation/${booking._id}`);
    } catch (err: any) {
      let errorMessage = 'Failed to create booking';
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors) {
          errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading show details...</div>;
  }

  if (error && !show) {
    return <div className="error">{error}</div>;
  }

  if (!show) {
    return <div className="error">Show not found</div>;
  }

  const movie = typeof show.movie === 'object' ? show.movie : null;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <div className="seat-grid-container">
        <h2>{movie?.title || 'Movie Booking'}</h2>
        <div className="show-info" style={{ marginBottom: '20px' }}>
          <p><strong>Screen:</strong> {show.screen}</p>
          <p><strong>Show Time:</strong> {new Date(show.showTime).toLocaleString()}</p>
          <p><strong>Language:</strong> {show.language}</p>
        </div>

        <div className="screen">SCREEN</div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-seat available regular"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat occupied"></div>
            <span>Occupied</span>
          </div>
        </div>

        <div className="seat-grid">
          {show.seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              <div className="row-label">{row[0]?.row}</div>
              {row.map((seat, seatIndex) => {
                const occupied = isSeatOccupied(seat);
                const selected = isSeatSelected(seat);
                return (
                  <div
                    key={seatIndex}
                    className={`seat ${seat.type} ${occupied ? 'occupied' : selected ? 'selected' : 'available'}`}
                    onClick={() => handleSeatClick(seat)}
                    title={`${seat.row}${seat.number} - ${seat.type} - ₹${seat.price}`}
                  >
                    {seat.number}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {!user ? (
          <div className="booking-summary">
            <h3>Enter Your Details</h3>
            {error && <div className="error" style={{ marginBottom: '15px' }}>{error}</div>}
            <form onSubmit={handleUserSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="filter-input"
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="filter-input"
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="filter-input"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={selectedSeats.length === 0}>
                {selectedSeats.length === 0 ? 'Select Seats First' : 'Continue to Booking'}
              </button>
            </form>
          </div>
        ) : (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>User:</span>
              <span>{user.name}</span>
            </div>
            <div className="summary-item">
              <span>Selected Seats:</span>
              <span>
                {selectedSeats.map((s) => `${s.row}${s.number}`).join(', ') || 'None'}
              </span>
            </div>
            <div className="summary-item">
              <span>Number of Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="total">
              <div className="summary-item">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            {error && (
              <div className="error" style={{ marginTop: '15px', marginBottom: '15px' }}>
                {error}
              </div>
            )}
            <button
              onClick={() => handleBookingSubmit()}
              disabled={selectedSeats.length === 0 || submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
            >
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;

