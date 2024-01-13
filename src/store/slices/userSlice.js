import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './authSlice';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getFavorites = createAsyncThunk(
  'user/getFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/favorites`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch favorites.');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'user/addFavorite',
  async ({ userId, externalAnimeId, animeTitle }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/favorites`, {
        userId,
        externalAnimeId,
        animeTitle
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add favorite.');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'user/removeFavorite',
  async ({ externalAnimeId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/favorites/${externalAnimeId}`, { withCredentials: true });
      return externalAnimeId;
    } catch (error) {
      return rejectWithValue('Failed to remove favorite.');
    }
  }
);

export const checkFavorite = createAsyncThunk(
    'user/checkFavorite',
    async ({ userId, animeId }, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/favorites/${animeId}`);
        return Boolean(response.data);
      } catch (error) {
        return rejectWithValue('Failed to check favorite.');
      }
    }
  );

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUserState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = [...state.favorites, action.payload];
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = state.favorites.filter(anime => anime.externalAnimeId !== action.payload);
    })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFavorite.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.favorites = [...state.favorites, action.meta.arg.animeId];
        } else {
          state.favorites = state.favorites.filter((animeId) => animeId !== action.meta.arg.animeId);
        }
      })
      .addCase(checkFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state, action) => {
        userSlice.caseReducers.resetUserState(state);
      })
  },
});

export const { clearError, resetUserState } = userSlice.actions;
export default userSlice.reducer;

