import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css';
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const Header = () => {

  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <header className="app-header">
      <Link to="/" className="logo">MyAnimeList</Link>
      {isAuthenticated ? (
        <div className="user-info">
          <LogoutButton className="logout-button" />
          <span className="username">{user.username}</span>
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