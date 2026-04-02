import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { bookingApi } from '../services/api';
import { Booking, Movie, Show } from '../types';
import './BookingHistory.css';

const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const token = useAppSelector((s) => s.auth.token);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true, state: { from: '/my-bookings' } });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingApi.getMine();
        if (!cancelled) setBookings(data);
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { error?: string } } };
        if (!cancelled) setError(ax.response?.data?.error || 'Could not load bookings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="container booking-history">
      <h2>My bookings</h2>
      <p className="booking-history-intro">
        Confirmed reservations tied to your signed-in account.
      </p>
      {loading && <div className="loading">Loading your bookings…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && bookings.length === 0 && (
        <div className="booking-history-empty">
          <p>No bookings yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse movies
          </Link>
        </div>
      )}
      {!loading && bookings.length > 0 && (
        <ul className="booking-history-list">
          {bookings.map((b) => {
            const show = typeof b.show === 'object' ? (b.show as Show) : null;
            const movie =
              show && typeof show.movie === 'object' ? (show.movie as Movie) : null;
            return (
              <li key={b._id} className="booking-history-item">
                <div>
                  <strong>{movie?.title || 'Movie'}</strong>
                  <span className="booking-meta">
                    {show
                      ? new Date(show.showTime).toLocaleString()
                      : 'Show details unavailable'}
                  </span>
                </div>
                <div className="booking-meta">
                  Seats: {b.seats.map((s) => `${s.row}${s.number}`).join(', ')} · ₹{b.totalAmount}
                </div>
                <Link to={`/booking-confirmation/${b._id}`} className="booking-detail-link">
                  View ticket
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;
