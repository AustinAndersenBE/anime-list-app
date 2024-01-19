import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './SearchBar.css';
import { useForm } from 'react-hook-form';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SearchBar = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleSearch = async (data) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/anime/search/${data.searchTerm}`);
      const results = response.data;
      navigate('/search-results', { state: { results } });
    } catch (error) {
      console.error('Error searching anime:', error);
      // logging for production purposes
    }
  };

  return (
    <div className="search-container">
      <Link to="/airing-anime" className="airing-anime-text">Airing Anime</Link>
      {isAuthenticated && <Link to="/favorites" className="favorites-text">Favorites</Link>}
      {isAuthenticated && <Link to="/my-posts" className="my-posts-text">My Posts</Link>}
      {isAuthenticated && <Link to="/following" className="following-text">Following</Link>}
      <form className="search-section" onSubmit={handleSubmit(handleSearch)}>
        <input
          type="text"
          className="search-input"
          placeholder="Search Anime..."
          {...register('searchTerm', { required: true })}
        />
        {errors.searchTerm && <p>Search term is required</p>}
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;