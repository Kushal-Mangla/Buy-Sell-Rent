// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = import.meta.env.VITE_BACKEND_URL;

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk('users/fetchAllUsers', async () => {
  const response = await axios.get(`${base_url}/api/admin/products/users/all-users`);
  return response.data.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  const response = await axios.delete(`${base_url}/api/admin/products/delete-user/${id}`);
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        console.log("Hello", action.payload);
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;