import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/status`); //returns { isAuthenticated, user }
      return response.data;
    } catch (error) {
      return rejectWithValue('An error occured while logging in.');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [checkAuthStatus.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [checkAuthStatus.fulfilled]: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    },
    [checkAuthStatus.rejected]: (state, action) => {
      state.loading = false;
      state.error = "An error has occured checking authentication"
    },
    // Handle other async actions here
  },
});

export default authSlice.reducer;