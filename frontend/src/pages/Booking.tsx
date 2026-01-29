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
      loadBookedSeats();
    }
  }, [selectedShow]);

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
    // In a real app, you'd fetch bookings for this show
    // For now, we'll simulate with empty set
    setBookedSeats(new Set());
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
      const newUser = await userApi.create(userForm);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleBookingSubmit = async () => {
    if (!user || selectedSeats.length === 0 || !show) {
      setError('Please select seats and provide user information');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await bookingApi.create({
        userId: user._id,
        showId: show._id,
        seats: selectedSeats,
      });

      alert('Booking confirmed! Booking ID will be shown here.');
      dispatch(clearBooking());
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
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
              <button type="submit" className="btn btn-primary">
                Continue
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
            {error && <div className="error" style={{ marginTop: '15px' }}>{error}</div>}
            <button
              onClick={handleBookingSubmit}
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

