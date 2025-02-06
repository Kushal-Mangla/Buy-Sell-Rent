import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/User/Navbar';
import Home from './pages/User/Home';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Admin from './pages/Admin/Admin';
import Dashboard from './pages/Admin/Dashboard';
import Orders from './pages/Admin/Orders';
import Notfound from './pages/Not_found/index';
import Products from './pages/Admin/Products';
import Authentication from './pages/Authentication/index';
import ShoppingHome from './pages/Shopping/Shoppinghome';
import NotAuthourised from './pages/Unauth-page/NotAuthourised';
import ItemList from './pages/Shopping/Listing1';
import Payment from './pages/Shopping/Payment';
import SearchItems from './pages/Additional/Searchitems';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { auth } from './store/Auth_Slice';
import Features from './pages/Admin/Features';
import AdminLayout from './components/admin-view/layout';
import UserProfile from './pages/User/Profile';
import ShopppingHeader from './pages/Shopping/header';
import ShopListing from './pages/Shopping/Listing';
import SellProducts from './pages/Shopping/sell';
import DeliverItemsPage from './pages/Shopping/deliver-items';
import OrdersManagement from './pages/Shopping/order-history';
import SupportChatbot from './pages/User/chatbot';
import SimpleComponent from './pages/User/empty';
import TokenHandler from './pages/User/settoken';

function App() {
    const {user, isAuthenticated, isLoading} = useSelector((state)=>state.auth);

    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(auth());
    }, [dispatch]);

    if(isLoading){
        return <h1>Loading...</h1>
    }
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={
          <Authentication></Authentication>
        }>
        </Route>
        <Route path="/user" element={
            <Authentication isAuthenticated={isAuthenticated} user_position={user}>
              <SimpleComponent />
            </Authentication>
          }>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/admin" element={
            <Authentication isAuthenticated={isAuthenticated} user_position={user}>
            <AdminLayout />
            </Authentication>
          }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="features" element={<Features />} />
        </Route>
        <Route path="/shopping-home" element={
            <Authentication isAuthenticated={isAuthenticated} user_position={user}>
            <ShopppingHeader />
            </Authentication>
            }>
            <Route path='profile' element={<UserProfile />} />
            <Route path="listing" element={<ShopListing />} />
            <Route path="payment" element={<Payment />} />
            <Route path="sell" element = {<SellProducts />} />
            <Route path="orders-history" element={<OrdersManagement />} />
            <Route path="deliver-items" element={<DeliverItemsPage />} />
            <Route path="Support" element={<SupportChatbot />} />
        </Route>
        <Route path="*" element={<Notfound />} />
        <Route path='not-authorised' element={<NotAuthourised />}/>
        <Route path='/search' element={<SearchItems />}></Route>
        <Route path='/set-token' element={<TokenHandler />}></Route>
      </Routes>
    </>
  );
}

export default App;