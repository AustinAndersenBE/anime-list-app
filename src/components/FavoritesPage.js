import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { getFavorites, removeFavorite } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './FavoritesPage.css';
import axios from 'axios';

// Dynamic rating validation schema
const ratingSchema = Yup.lazy((values) => {
  const schemaFields = {};
  for (const key in values) {
    if (key.startsWith('rating-')) {
      schemaFields[key] = Yup.number()
        .required('Rating is required')
        .min(0, 'Rating must be at least 0')
        .max(10, 'Rating must be at most 10')
        .nullable();
    }
  }
  return Yup.object().shape(schemaFields);
});

// Ratings state used to keep track of user's ratings
const FavoritesPage = () => {
  const [ratings, setRatings] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(ratingSchema)
  });
  const { user } = useSelector(state => state.auth);
  const { favorites, loading, error } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(getFavorites(user.id));
    }
  }, [dispatch, user]);


  // Creating an object with key, externalAnimeId and value, rating
  useEffect(() => {
    if (favorites) {
      const initialRatings = favorites.reduce((acc, anime) => {
        acc[anime.externalAnimeId] = anime.rating || 0; // Use externalAnimeId as the key
        return acc;
      }, {});
      setRatings(initialRatings);
    }
  }, [favorites]);

  const handleRatingChange = (externalAnimeId, newRating) => {
    const ratingNum = parseFloat(newRating);
    if (!isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 10) {
      setRatings(prevRatings => ({ ...prevRatings, [externalAnimeId]: ratingNum }));
    }
  };

  const submitAllRatings = () => {
    const ratingsArray = favorites.map(anime => ({
      externalAnimeId: anime.externalAnimeId,
      rating: ratings[anime.externalAnimeId]
    }));
    
    console.log('Submitting the following ratings:', ratingsArray);
  
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/favorites/update-rating`, {
      userId: user.id,
      ratings: ratingsArray
    })
    .then(response => {
      dispatch(getFavorites(user.id));
    })
    .catch(error => {
      console.error('Error updating ratings:', error);
    });
  };

  const handleStarClick = (anime) => {
    dispatch(removeFavorite({ externalAnimeId: anime.externalAnimeId }));
  };

  const handlePostClick = anime => {
    navigate('/post-form', { state: { externalAnimeId: anime.externalAnimeId } });
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
          <FontAwesomeIcon
            className="pencil-icon"
            icon={faPencilAlt}
            onClick={() => handlePostClick(anime)}
          />
          <input
            name={`rating-${anime.externalAnimeId}`}
            ref={register(`rating-${anime.externalAnimeId}`)}
            defaultValue={anime.rating ? parseFloat(anime.rating) : ''}
            placeholder="Rating"
            onChange={(e) => handleRatingChange(anime.externalAnimeId, e.target.value)}
          />
          {errors[`rating-${anime.id}`] && <p>{errors[`rating-${anime.id}`].message}</p>}
        </div>
      ))}
      <button type="button" onClick={submitAllRatings}>Update Ratings</button>
    </div>
  );
};

export default FavoritesPage;