import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  orders: [], // All orders for the user (both bought and sold)
  loading: false,
  error: null,
  AllUsers: []
};
const base_url = import.meta.env.VITE_BACKEND_URL;
// Async Thunk: Place an order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${base_url}/api/shopping-home/order/checkout`, { userId });
      console.log("PlaceOrder", response);
      return response.data; // Array of orders created
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk: Fetch orders history
export const fetchOrdersHistory = createAsyncThunk(
  "order/fetchOrdersHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/api/shopping-home/order/orders-history/${userId}`);
      return response.data.data; // { boughtOrders, soldOrders }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${base_url}/api/shopping-home/order/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// async thunc to update otp 
export const updateOTP = createAsyncThunk(
  'orders/updateOTP',
  async ({OrderId, newOtp}) => {
    try {
      console.log("OrderId, newOtp", OrderId, newOtp);
      const response = await axios.patch(`${base_url}/api/shopping-home/order/orders/${OrderId}/update-otp`, { newOtp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk: Deliver an order
export const deliverOrder = createAsyncThunk(
  "order/deliverOrder",
  async ({ orderId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${base_url}/api/shopping-home/order/deliver-item`, { orderId, otp });
      return response.data.data; // Updated order
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const allUsers = createAsyncThunk(
  "/users/allUsers",
  async () => {
      const response = await axios.get(`${base_url}/api/shopping-home/order/all-users`);
      return response?.data;
  }
);

// Order Slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Place Order
    builder.addCase(placeOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.orders = null;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload; // Array of orders created
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.orders = null;
    });

    // Fetch Orders History
    builder.addCase(fetchOrdersHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrdersHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload; // { boughtOrders, soldOrders }
    });
    builder.addCase(fetchOrdersHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // Deliver Order
    builder.addCase(deliverOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deliverOrder.fulfilled, (state, action) => {
      state.loading = false;
      // Update the order status in the state
      const updatedOrder = action.payload;
      state.orders.boughtOrders = state.orders.boughtOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      state.orders.soldOrders = state.orders.soldOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
    });
    builder.addCase(deliverOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    }).addCase(allUsers.fulfilled, (state, action) => {
      state.AllUsers = action.payload;
  });
  },
});

export default orderSlice.reducer;