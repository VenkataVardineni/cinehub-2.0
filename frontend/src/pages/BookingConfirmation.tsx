import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';
import { Booking, User } from '../types';
import './BookingConfirmation.css';

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getById(bookingId!);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking confirmation...</div>;
  }

  if (error || !booking) {
    return (
      <div className="container">
        <div className="error">{error || 'Booking not found'}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  const show = typeof booking.show === 'object' ? booking.show : null;
  const movie = show && typeof show.movie === 'object' ? show.movie : null;
  const user = typeof booking.user === 'object' ? booking.user : null;

  return (
    <div className="container">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Your booking has been successfully confirmed. We look forward to seeing you at the show!
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h2>Booking Details</h2>
            <div className="detail-item">
              <strong>Booking ID:</strong>
              <span>{booking._id}</span>
            </div>
            <div className="detail-item">
              <strong>Status:</strong>
              <span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <strong>Booking Date:</strong>
              <span>{new Date(booking.bookingDate).toLocaleString()}</span>
            </div>
          </div>

          {movie && (
            <div className="detail-section">
              <h2>Movie Information</h2>
              <div className="detail-item">
                <strong>Movie:</strong>
                <span>{movie.title}</span>
              </div>
              {show && (
                <>
                  <div className="detail-item">
                    <strong>Show Time:</strong>
                    <span>{new Date(show.showTime).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Screen:</strong>
                    <span>{show.screen}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="detail-section">
            <h2>Seat Information</h2>
            <div className="seats-list">
              {booking.seats.map((seat, index) => (
                <div key={index} className="seat-badge">
                  {seat.row}{seat.number} ({seat.type})
                </div>
              ))}
            </div>
            <div className="detail-item total-amount">
              <strong>Total Amount:</strong>
              <span>₹{booking.totalAmount}</span>
            </div>
          </div>

          {user && (
            <div className="detail-section">
              <h2>User Information</h2>
              <div className="detail-item">
                <strong>Name:</strong>
                <span>{user.name}</span>
              </div>
              <div className="detail-item">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <strong>Phone:</strong>
                <span>{user.phone}</span>
              </div>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Book Another Movie
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary">
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

