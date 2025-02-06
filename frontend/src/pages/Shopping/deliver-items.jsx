import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersHistory, deliverOrder } from "../../store/shop/Orders"; // Adjust the import path

const DeliverItemsPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [otp, setOtp] = useState("");
  const [orderId, setOrderId] = useState("");
  const {user} = useSelector((state)=>state.auth);

  const userId = user.id; // Get the logged-in user's ID

  useEffect(() => {
    dispatch(fetchOrdersHistory(userId));
  }, [dispatch, userId]);

  const handleDeliver = async () => {
    if (!orderId || !otp) {
      alert("Please enter Order ID and OTP.");
      return;
    }

    const resultAction = await dispatch(deliverOrder({ orderId, otp }));

    if (deliverOrder.fulfilled.match(resultAction)) {
      alert("Order delivered successfully!");
      setOtp("");
      setOrderId("");
    } else {
      alert("Failed to deliver order: " + (resultAction.payload?.message || "Unknown error"));
    }
  };

  const pendingOrders = orders.soldOrders?.filter((order) => order.status === "pending") || [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Deliver Items</h1>
      <div>
        <h2>Pending Orders</h2>
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div key={order._id}>
              <p>Order ID: {order._id}</p>
              <p>Buyer ID: {order.buyerId}</p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={() => setOrderId(order._id)}>Select Order</button>
                <button onClick={handleDeliver} disabled={!orderId || !otp}>
                  Deliver
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders to deliver.</p>
        )}
      </div>
    </div>
  );
};

export default DeliverItemsPage;