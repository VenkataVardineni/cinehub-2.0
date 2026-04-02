import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingHistory from './pages/BookingHistory';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <main className="App-main">
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/booking/:showId" element={<Booking />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-bookings" element={<BookingHistory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
