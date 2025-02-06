import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import UserCartItemsContent from "./cart-item-content";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../store/shop/Orders"; // Adjust the import path
import { fetchCartItems } from "../../store/shop/Cart";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.order); // Get loading and error states from Redux
  const { user } = useSelector((state) => state.auth); // Get the logged-in user from Redux

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleCheckout = async () => {
    const userId = user?.id;
    // console.log("userId", user);
    if (!userId) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    // Dispatch the placeOrder action
    const resultAction = dispatch(placeOrder(userId)).then((response)=> {
      console.log("my response",response);
      if(response?.payload)
      {
        dispatch(fetchCartItems(userId)).then((response)=>{
          console.log("Cart cleared successfully");
        })
        alert("Order Placed successfully")
        navigate("/shopping-home/orders-history")
        setOpenCartSheet(false);
      }
    });
  };

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))
          : <p>Your cart is empty.</p>}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={handleCheckout}
        className="w-full mt-6"
        disabled={loading || !cartItems || cartItems.length === 0} // Disable button if loading or cart is empty
      >
        {loading ? "Placing Order..." : "Checkout"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </SheetContent>
  );
}

export default UserCartWrapper;