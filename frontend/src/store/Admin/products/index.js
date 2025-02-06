import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { all } from 'axios';
import env from 'dotenv';
const base_url = import.meta.env.VITE_BACKEND_URL;
const initialState = {
    isLoading: false,
    productList: [],
    users: [],
};


const AdminProductsSlice = createSlice({
    name: 'adminproducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled, (state, action) => {
            console.log(action.payload);
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false;
            state.productList = [];
        }).addCase(allUsers.pending, (state) => {
            state.isLoading = true;
        }).addCase(allUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload.data;
        }).addCase(allUsers.rejected, (state) => {
            state.isLoading = false;
            state.users = [];
        });
    },
});

export const addNewProduct = createAsyncThunk(
    '/products/addNewProduct',
    async (formData) => {
        const response = await axios.post(`${base_url}/api/admin/products/add-product`, formData, {
            headers:{
                'Content-Type': 'application/json',
            }
        });
        console.log(response?.data);
        return response?.data;
    }
);

export const fetchAllProducts = createAsyncThunk(
    '/products/fetchAllProducts',
    async () => {
        const response = await axios.get(`${base_url}/api/admin/products/get-products`);
        return response?.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
        const response = await axios.delete(`${base_url}/api/admin/products/delete-product/${id}`);
        return response?.data;
    }
);

export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async (data) => {
        const response = await axios.put(`${base_url}/api/admin/products/edit-product/${data.id}`, data.formData);
        return response?.data;
    }
);

export const allUsers = createAsyncThunk(
    "/users/allUsers",
    async () => {
        const response = await axios.get(`${base_url}/api/admin/users/all-users`);
        return response?.data;
    }
);
export default AdminProductsSlice.reducer;