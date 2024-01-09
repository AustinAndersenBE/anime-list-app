import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="logo">MyAnimeList</Link>
      {isAuthenticated ? (
        <div className="user-info">
          <span className="username">{user.username}</span>
          <button className="logout-button">Logout</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="button">Login</Link>
          <Link to="/signup" className="button button-signup">Sign Up</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
