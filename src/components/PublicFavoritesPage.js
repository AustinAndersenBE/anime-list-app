import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PublicFavoritesPage = () => {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/public-users/${userId}/favorites`);
        setFavorites(response.data);
      } catch (err) {
        setError('Error fetching favorites');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="favorites-container">
      <h1>User's Favorites</h1>
      {favorites.map(anime => (
        <div key={anime.id} className="favorite-item">
          <h2>{anime.animeTitle}</h2>
        </div>
      ))}
    </div>
  );
};

export default PublicFavoritesPage;
