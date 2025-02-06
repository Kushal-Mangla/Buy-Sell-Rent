import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Auth_Slice';
import adminProductsSlice from './Admin/products';
import AdminProducts from "../pages/Admin/Products";
import userSlice from "../store/Admin/products/UserSlice";
import shopSlice from "../store/shop/Products";
import cartSlice from "../store/shop/Cart";
import orderSlice from "../store/shop/Orders";
import reviewReducer from "../store/shop/Orders/reviewSlice"
const store = configureStore({
    reducer: {
        auth : authReducer,
        adminProducts: adminProductsSlice,
        users: userSlice,
        shop: shopSlice,
        shopCart: cartSlice,
        order: orderSlice,
        review: reviewReducer,
    },
});

export default store;