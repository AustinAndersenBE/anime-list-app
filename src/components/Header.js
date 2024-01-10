import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Header.css';
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';

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
          <LoginButton />
          <SignupButton />
        </div>
      )}
    </header>
  );
};

export default Header;
