import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);

  return (
    <nav className="navbar" aria-label="Main">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          CineHub 2.0
        </Link>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            Movies
          </NavLink>
          {token && user && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              My bookings
            </NavLink>
          )}
          {!token ? (
            <>
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-nav">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="navbar-user" title={user?.email}>
                Hi, {user?.name?.split(' ')[0]}
              </span>
              <button
                type="button"
                className="btn btn-nav-outline"
                onClick={() => dispatch(logout())}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
