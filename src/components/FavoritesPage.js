import React, { useEffect, useState } from 'react'; // Import useState
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { getFavorites, removeFavorite, clearError } from '../store/slices/userSlice'; // Import clearError
import './FavoritesPage.css';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { favorites, loading, error } = useSelector(state => state.user);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user && initialLoad) {
      dispatch(getFavorites(user.id));
      setInitialLoad(false);
    }
  }, [dispatch, user, initialLoad]);

  useEffect(() => {
    return () => {
      dispatch(clearError()); // Use the clearError action from userSlice
    };
  }, [dispatch]);

  const handleStarClick = (anime) => {
    dispatch(removeFavorite({ externalAnimeId: anime.externalAnimeId }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      {favorites.map(anime => (
        <div key={anime.id} className="favorite-item">
          <h2>{anime.animeTitle}</h2>
          <FontAwesomeIcon
            className="star-icon"
            icon={fasStar}
            onClick={() => handleStarClick(anime)}
          />
        </div>
      ))}
    </div>
  );
};

export default FavoritesPage;
