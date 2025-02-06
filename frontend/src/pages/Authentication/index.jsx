import React from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Authentication({isAuthenticated, user_position, children}) {
    const location = useLocation();

    if (location.pathname === "/") {
        if (!isAuthenticated) {
          return <Navigate to="/user/login" />;
        } else {
          if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" />;
          } else {
            return <Navigate to="/shopping-home/profile" />;
          }
        }
      }

    if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        return (
            console.log("Arya",isAuthenticated, user_position, location.pathname),
            console.log("back to login"),
            <Navigate to="/user/login" />
        );
    }

    if(isAuthenticated && (location.pathname.includes("login") || location.pathname.includes("register"))) {
        if(user_position?.role === "admin") {
            return (
                console.log(isAuthenticated, user_position, location.pathname),
                console.log("back to admin"),
                <Navigate to="/admin/dashboard" />
            );
        }
        else {
            return (
                console.log(isAuthenticated, user_position, location.pathname),
                console.log("back to shopping"),
                <Navigate to="/shopping-home/profile" />
            );
        }
    }

    if(isAuthenticated && location.pathname.includes("admin") && user_position?.role !== "admin") {
        return (
            console.log(isAuthenticated, user_position, location.pathname),
            <Navigate to="/not-authorised" />
        );
    } 

    if(isAuthenticated && user_position?.role === "admin" &&location.pathname.includes("shopping")) {
        return (
            <Navigate to="/admin/dashboard" />
        );
    }

    return children;
}

export default Authentication;