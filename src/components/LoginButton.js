import React from 'react';
import { Link } from 'react-router-dom';
import './LoginButton.css';

const LoginButton = () => {
  return (
    <Link to="/login" className="login-button">Login</Link>
  );
};

export default LoginButton;
