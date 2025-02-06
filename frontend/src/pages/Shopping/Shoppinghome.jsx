import React from "react";
import { Outlet } from "react-router-dom";

function ShoppingHome() {
    return (
        <div>
        <h1>Shopping Home</h1>
        <Outlet />
        </div>
    );
}

export default ShoppingHome;