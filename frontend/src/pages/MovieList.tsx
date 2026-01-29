import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { movieApi } from '../services/api';
import { setMovies, setFilters } from '../store/slices/movieSlice';
import { Movie } from '../types';
import './MovieList.css';

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, filters } = useAppSelector((state) => state.movies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, [filters]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieApi.getAll(filters);
      dispatch(setMovies(data));
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value || undefined }));
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="container">
      <h2>Now Showing</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          className="filter-input"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          className="filter-select"
          value={filters.language || ''}
          onChange={(e) => handleFilterChange('language', e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Telugu">Telugu</option>
          <option value="Tamil">Tamil</option>
        </select>
        <select
          className="filter-select"
          value={filters.genre || ''}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
          <option value="Horror">Horror</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {movies.length === 0 ? (
        <div className="loading">No movies found</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => handleMovieClick(movie._id)}
            >
              <img src={movie.posterUrl} alt={movie.title} />
              <div className="movie-card-content">
                <h3>{movie.title}</h3>
                <p>{movie.genre.join(', ')}</p>
                <p>{movie.language} • {movie.duration} min</p>
                <p>⭐ {movie.rating}/10</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;

