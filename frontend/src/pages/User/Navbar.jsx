// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../CSS/navbar.css';
import "../Additional/Searchitems"
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/Auth_Slice';

const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await dispatch(logoutUser()).unwrap();
      if (response.success) {
        navigate('/user/login');
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <nav className="navbar">
      <div className="navbar-logo">Buy & Sell</div>
      <div className="navbar-links">
        <Link to="/user/login" className="nav-link">Login</Link>
        <Link to="/user/register" className="nav-link">Register</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <button onClick={handleLogout} className="nav-link">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;