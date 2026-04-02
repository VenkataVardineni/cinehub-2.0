import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { movieApi } from '../services/api';
import { setMoviePage, setFilters, setPage } from '../store/slices/movieSlice';
import './MovieList.css';

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, filters, page, totalPages, total } = useAppSelector((state) => state.movies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMovies = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieApi.getAll({ ...filters, page: pageNum, limit: 12 });
        dispatch(
          setMoviePage({
            movies: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
            limit: data.limit,
          })
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, filters]
  );

  useEffect(() => {
    loadMovies(page);
  }, [filters, page, loadMovies]);

  // Sync search input with filters when filters change externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setPage(1));
    dispatch(setFilters({ ...filters, [key]: value || undefined }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search - update filter after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setPage(1));
      dispatch(setFilters({ ...filters, search: value || undefined }));
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="container">
      <h2>Now Showing</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          className="filter-input"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
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
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
          <option value="Crime">Crime</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Musical">Musical</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && movies.length === 0 ? (
        <div className="loading">Loading movies...</div>
      ) : movies.length === 0 ? (
        <div className="loading">No movies found</div>
      ) : (
        <>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => handleMovieClick(movie._id)}
            >
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/300/450?random=${movie._id}`;
                }}
              />
              <div className="movie-card-content">
                <h3>{movie.title}</h3>
                <p>{movie.genre.join(', ')}</p>
                <p>{movie.language} • {movie.duration} min</p>
                <p>⭐ {movie.rating}/10</p>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pagination" role="navigation" aria-label="Movie pages">
            <button
              type="button"
              className="btn pagination-btn"
              disabled={page <= 1 || loading}
              onClick={() => dispatch(setPage(page - 1))}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
              <span className="pagination-total"> ({total} movies)</span>
            </span>
            <button
              type="button"
              className="btn pagination-btn"
              disabled={page >= totalPages || loading}
              onClick={() => dispatch(setPage(page + 1))}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default MovieList;

