import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = import.meta.env.VITE_BACKEND_URL;
// Async thunks
export const submitReview = createAsyncThunk(
    'review/submit',
    async ({ sellerId, rating, comment, orderId, userId }) => {
        console.log("Details", sellerId,rating,comment,orderId)
        try {

            const response = await axios.post(`${base_url}/api/shopping-home/order-history/reviews`,
                { sellerId, rating, comment, orderId, userId }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to submit review'
            );
        }
    }
);

export const fetchSellerReviews = createAsyncThunk(
    'review/fetchSellerReviews',
    async (sellerId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${base_url}/api/shopping-home/order-history/seller/${sellerId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch reviews'
            );
        }
    }
);

// Slice
const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearReviewState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit review
            .addCase(submitReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews.push(action.payload.review);
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch seller reviews
            .addCase(fetchSellerReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerReviews.fulfilled, (state, action) => {
                console.log(state.payload);
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.averageRating = action.payload.averageRating;
                state.totalReviews = action.payload.totalReviews;
            })
            .addCase(fetchSellerReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;