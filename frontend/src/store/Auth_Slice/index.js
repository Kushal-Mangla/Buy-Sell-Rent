// create a slice for authentication
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    recaptchaVerified: false,
    error: null,
};
const base_url = import.meta.env.VITE_BACKEND_URL;
const authslice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser:(state, action) => {
        },
        SET_TOKEN_SUCCESS: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        SET_TOKEN_FAIL: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = action.payload.message;
        }
    },
    extraReducers: (builder)=>
    {
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(registerUser.rejected, (state)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action)=>{
            console.log(action);
            state.isLoading = false;
            state.user = action.payload.success? action.payload.user : null;
            state.isAuthenticated = action.payload.success? true : false;
        }).addCase(loginUser.rejected, (state)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(auth.pending, (state)=>{
            state.isLoading = true;
        }).addCase(auth.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            user : null,
            state.isAuthenticated = action.payload.success? true : false;
        }).addCase(auth.rejected, (state)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(logoutUser.fulfilled, (state)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(updateUserProfile.pending, (state)=>{
            state.isLoading = true;
        }).addCase(updateUserProfile.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.success? action.payload.user : null;
            console.log(action.payload);
            state.isAuthenticated = action.payload.success? true : false;
        }).addCase(updateUserProfile.rejected, (state)=>{
            state.isLoading = false;
            state.error = action.payload;
            state.user = null;
            state.isAuthenticated = true;
        }).addCase(verifyRecaptcha.fulfilled, (state, action) => {
            state.recaptchaVerified = action.payload.success; // Set true if verification passes
            state.error = null;
        }).addCase(verifyRecaptcha.rejected, (state, action) => {
            state.recaptchaVerified = false;
            state.error = action.payload;
        }).addCase(authenticateByEmail.pending, (state, action) => {
            state.isLoading = false;
        }).addCase(authenticateByEmail.fulfilled, (state, action) => {
            console.log("MY user", action.payload.user);
            console.log("User updated");
            state.user = action.payload.user
        })
    }
});

export const verifyRecaptcha = createAsyncThunk(
    "auth/verifyRecaptcha",
    async (token, { rejectWithValue }) => {
        try {
            console.log("Base url", base_url);
            const response = await axios.post(`${base_url}/api/user/verify-recaptcha`, { token });
            return response.data; // Expecting { success: true } from backend
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error verifying reCAPTCHA");
        }
    }
);

export const auth = createAsyncThunk(
    'auth/authenticate',
    async () => {
        try {
            const response = await axios.get(`${base_url}/api/user/auth-user`, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
                }

            });
            console.log("cookie");
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const authenticateByEmail = createAsyncThunk(
    'auth/authenticateByEmail',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${base_url}/api/user/auth-user-email/${email}`, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
                }
            });
            console.log("Email authentication response:", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (formData, { rejectWithValue }) => {
        try {
            console.log("backend");
            console.log(formData);
            const response = await axios.post(`${base_url}/api/user/register`, formData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${base_url}/api/user/login`, formData, {
                withCredentials: true,
            });
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "/user/logout",
  
    async () => {
      const response = await axios.post(
        `${base_url}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${base_url}/api/user/profile-update`, userData, {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const { setUser, SET_TOKEN_SUCCESS, SET_TOKEN_FAIL } = authslice.actions;
export default authslice.reducer;
