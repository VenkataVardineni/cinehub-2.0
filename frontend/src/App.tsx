import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>CineHub 2.0</h1>
          </header>
          <Routes>
            <Route path="/" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/booking/:showId" element={<Booking />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
