import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AiringAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const { register, handleSubmit, getValues } = useForm();

  const fetchAiringAnime = async (data) => {
    try {
      const response = await axios.post(`http://localhost:3001/anime/airing`, data); //hard coded to debug
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
      <h1>Airing Anime</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("page")} placeholder="Page" />
        <input {...register("limit")} placeholder="Limit" />
        <button type="submit">Search</button>
      </form>

      <div className="anime-list">
        {animeList.map(anime => (
          <div key={anime.mal_id} className="anime-item">
            <h2>{anime.title}</h2>
            <img src={anime.images.jpg.image_url} alt={anime.title} />
            <p>{anime.synopsis}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiringAnime;