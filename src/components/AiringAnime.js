import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './AiringAnime.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const AiringAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const { register, handleSubmit, getValues } = useForm();

  const fetchAiringAnime = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/anime/airing`, data); //hard coded to debug
      setAnimeList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAiringAnime({ page: 1, limit: 10 });
  }, []);

  const onSubmit = () => {
    const values = getValues();
    const effectiveData = {
      page: values.page || 1,
      limit: values.limit || 10
    };
    fetchAiringAnime(effectiveData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("page")} placeholder="Page" />
        <input {...register("limit")} placeholder="Limit" />
        <button type="submit">Search</button>
      </form>

      <div className="anime-list">
      {animeList.map(anime => (
        <div key={anime.mal_id} className="anime-item">
          <img src={anime.images.jpg.image_url} alt={anime.title_english} />
          <div className="anime-content">
            <h2>{anime.title_english}</h2>
            <p>{anime.synopsis}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default AiringAnime;