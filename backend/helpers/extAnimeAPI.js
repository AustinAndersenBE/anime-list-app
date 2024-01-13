const axios = require('axios');

const API_BASE_URL = 'https://api.jikan.moe/v4';

exports.getAnimeById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/anime/${id}`);
  return response.data;
};

exports.searchAnime = async (query) => {
  const limit = 10;
  const response = await axios.get(`${API_BASE_URL}/anime?q=${query}&limit=${limit}`);
  return response.data;
};