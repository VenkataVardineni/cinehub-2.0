import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { movieApi, showApi } from '../services/api';
import { setSelectedShow } from '../store/slices/bookingSlice';
import { Movie, Show } from '../types';
import './MovieDetail.css';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadMovie();
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      loadShows();
    }
  }, [id, selectedDate]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getById(id!);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie');
    } finally {
      setLoading(false);
    }
  };

  const loadShows = async () => {
    try {
      const data = await showApi.getByMovieId(id!, selectedDate);
      setShows(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load shows');
    }
  };

  const handleShowSelect = (show: Show) => {
    setSelectedShowId(show._id);
    dispatch(setSelectedShow(show));
    navigate(`/booking/${show._id}`);
  };

  const formatShowTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error || !movie) {
    return <div className="error">{error || 'Movie not found'}</div>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn" style={{ marginBottom: '20px' }}>
        ← Back to Movies
      </button>
      <div className="movie-detail">
        <div className="movie-detail-header">
          <div className="movie-detail-poster">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className="movie-detail-info">
            <h1>{movie.title}</h1>
            <p><strong>Genre:</strong> {movie.genre.join(', ')}</p>
            <p><strong>Language:</strong> {movie.language}</p>
            <p><strong>Duration:</strong> {movie.duration} minutes</p>
            <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
            {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
            {movie.cast && movie.cast.length > 0 && (
              <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
            )}
            <p style={{ marginTop: '20px' }}>{movie.description}</p>
          </div>
        </div>

        <div className="shows-section">
          <h2>Select Showtime</h2>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="date-select" style={{ marginRight: '10px' }}>Date: </label>
            <input
              id="date-select"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="filter-input"
              style={{ width: 'auto', display: 'inline-block' }}
            />
          </div>

          {shows.length === 0 ? (
            <div className="loading">No shows available for this date</div>
          ) : (
            <div className="shows-grid">
              {shows.map((show) => (
                <div
                  key={show._id}
                  className={`show-card ${selectedShowId === show._id ? 'selected' : ''}`}
                  onClick={() => handleShowSelect(show)}
                >
                  <div className="show-time">{formatShowTime(show.showTime)}</div>
                  <div className="show-info">Screen: {show.screen}</div>
                  <div className="show-info">Language: {show.language}</div>
                  <div className="show-info">Available: {show.availableSeats} seats</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

