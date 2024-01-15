import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { addFavorite, removeFavorite } from '../store/slices/userSlice';

const SearchResults = () => {
  // Hooks and Redux state initialization
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.user.favorites);
  const { user, isAuthenticated } = useSelector((state) => state.auth); 

  // Redirect if no search results are present
  useEffect(() => {
    if (!location.state || !location.state.results) {
      navigate('/');
    }
  }, [location.state, navigate]);

  // Return null to prevent rendering if no search results
  if (!location.state || !location.state.results) {
    return null;
  }

  // Handler for adding or removing favorites
  const handleStarClick = (anime) => {
    const externalAnimeId = String(anime.mal_id);
    if (favorites.includes(externalAnimeId)) {
      dispatch(removeFavorite({ userId: user.id, externalAnimeId }));
    } else {
      dispatch(addFavorite({ userId: user.id, externalAnimeId, animeTitle: anime.title_english }));
    }
  };

  const { results } = location.state;

  // Render search results
  return (
    <div>
      <h1>Search Results</h1>
      <ul>
        {results.data.map((anime) => (
          <li key={anime.mal_id}>
            {isAuthenticated && (
              <FontAwesomeIcon
                icon={favorites.some(favorite => favorite.externalAnimeId === String(anime.mal_id)) ? fasStar : farStar}
                onClick={() => handleStarClick(anime)}
              />
            )}
            {anime.title_english}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;