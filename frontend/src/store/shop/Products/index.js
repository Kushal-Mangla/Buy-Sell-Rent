import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import product from '../../../../../backend/models/product';

const base_url = import.meta.env.VITE_BACKEND_URL;
const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
}

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            // console.log(action.payload);
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllFilteredProducts.rejected, (state) => {
            state.isLoading = false;
            state.productList = [];
        }).addCase(fetchProductDetails.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productDetails = action.payload.data;
        }).addCase(fetchProductDetails.rejected, (state) => {
            state.isLoading = false;
            state.productDetails = null;
        });
    },
});

export const fetchAllFilteredProducts = createAsyncThunk(
    '/shop/fetchAllFilteredProducts',
    async (filterparams) => {
        const cleanParams = {};
        // console.log("kushal",filterparams);
        
        // Check if filterparams exists and has a filterparams property
        if (filterparams && filterparams.filterparams) {
            Object.keys(filterparams.filterparams).forEach(key => {
                // Filter out empty strings and create clean params
                const validValues = filterparams.filterparams[key].filter(val => val !== "");
                if (validValues.length) {
                    cleanParams[key] = validValues;
                }
            });
        }

        const query = new URLSearchParams(cleanParams);
        // console.log("query",query);
        const response = await axios.get(`${base_url}/api/shop/get-filteredProducts?${query}`);
        return response?.data;
    }
);
export const fetchProductDetails = createAsyncThunk(
    '/shop/fetchProductDetails',
    async (productId) => {
        const response = await axios.get(`${base_url}/api/shop/get-productDetails/${productId}`);
        return response?.data;
    }
);

export default shopSlice.reducer;