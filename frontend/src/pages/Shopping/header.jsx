import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Button } from "../../components/ui/button";
import { HousePlug, Menu } from "lucide-react";
import { Label } from "../../components/ui/label";
import { MenuShoppingItems } from "../../form_create/index"
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { UserCog, LogOut, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/Auth_Slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartWrapper from "./cart-wrapper";
import { fetchCartItems } from "../../store/shop/Cart";
import CartButton from "./cart-button.jsx";
import { authenticateByEmail } from "../../store/Auth_Slice";
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  // remove it as it is not being used
  useEffect(()=> {
    const userInfoString = localStorage.getItem('user');
    console.log("Memory",userInfoString);
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const email = userInfo.email;
        if (email) {
          dispatch(authenticateByEmail(email)).then((response) => {
            console.log("CAS login response", response);
          }).catch((error) => {
            console.error("Authentication failed", error);
          });
        }
      } catch (error) {
        console.error("Error parsing user info from local storage", error);
      }
  }}, [])
  // console.log("cartItems", cartItems);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <CartButton 
          count={cartItems?.items?.length || 0}
          onClick={() => setOpenCartSheet(true)}
        />
        <CartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

        <div className="flex items-center gap-4 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="group">
            <Avatar className="bg-black cursor-pointer">
              <AvatarFallback className="bg-black text-white font-extrabold group-hover:bg-gray-800">
                {
                  console.log("Hey", user)
                }
                {user?.fname[0].toUpperCase() + user?.lname[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="bottom" 
            align="end" 
            className="z-50 mt-2 absolute top-full right-0 w-56"
          >
            <DropdownMenuLabel>Logged in as {user?.fname}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shopping-home/profile")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
function MenuItems() {
  const navigate = useNavigate();
  function handleNavigate(menuItem) {
    // console.log(menuItem.path);
    navigate(menuItem.path);
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {MenuShoppingItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
    const { isAuthenticated } = useSelector((state) => state.auth);
  
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-2">
            <HousePlug className="h-6 w-6" />
            <span className="font-bold">Ecommerce</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            <MenuItems />
          </div>
  
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
        <main>
          <Outlet />
        </main>

      </header>
    );
  }
  
  export default ShoppingHeader;