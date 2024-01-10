import React from 'react';
import { Link } from 'react-router-dom';

const SignupButton = () => {
  return (
    <Link to="/signup" className="signup-button">Sign Up</Link>
  );
};

export default SignupButton;
