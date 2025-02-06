import Order from "../../models/order.js";
import Cart from "../../models/cart.js";
import Product from "../../models/product.js";
import bcrypt from 'bcryptjs';
import User from "../../models/user.js";

const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty!",
      });
    }

    // Group cart items by seller
    const ordersBySeller = {};
    cart.items.forEach((item) => {
        console.log(item);
      const sellerId = item.productId.sellerId;
      if (!ordersBySeller[sellerId]) {
        ordersBySeller[sellerId] = [];
      }
      ordersBySeller[sellerId].push(item);
    });

    // Create orders for each seller
    const orders = [];
    for (const sellerId in ordersBySeller) {
      const items = ordersBySeller[sellerId];
      const totalAmount = items.reduce((sum, item) => {
        const product = item.productId;
        const price = product.salePrice > 0 ? product.salePrice : product.price;
        return sum + price * item.quantity;
      }, 0);

      // Generate a random OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("otp",otp);
      // random otp should be a 4 digit number

      // encrypt the otp and then save
      const hashedOtp = await bcrypt.hash(otp, 10);
      // Create an order
      const order = new Order({
        buyerId: userId,
        sellerId,
        items: items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.salePrice > 0 ? item.productId.salePrice : item.productId.price,
        })),
        totalAmount,
        status: "pending",
        otp: hashedOtp // Store the OTP (will be hashed by the pre-save hook)
      });

      await order.save();
      orders.push({ order, otp }); // Store order and OTP for response
    }

    // Clear the cart
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      success: true,
      message: "Orders placed successfully!",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error during checkout",
    });
  }
};

const updateOTP = async (req, res) => {
  try {
    console.log(req.body);
    const orderId = req.params.id;
    const otp = req.body.newOtp;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const hashedOtp = await bcrypt.hash(otp, 10);
    order.otp = hashedOtp;
    await order.save();

    res.status(200).json({ message: "OTP updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.cancelOrder();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersHistory = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch orders where the user is the buyer
      const boughtOrders = await Order.find({ buyerId: userId }).populate("items.productId");
  
      // Fetch orders where the user is the seller
      const soldOrders = await Order.find({ sellerId: userId }).populate("items.productId");
  
      res.status(200).json({
        success: true,
        data: {
          boughtOrders,
          soldOrders,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error fetching orders history",
      });
    }
};

const deliverItem = async (req, res) => {
    try {
      const { orderId, otp } = req.body;
  
      // Fetch the order
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      // Verify the OTP
      const isOTPValid = await bcrypt.compare(otp, order.otp);
  
      if (!isOTPValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP!",
        });
      }
  
      // Update the order status
      order.status = "completed";
      await order.save();
  
      res.status(200).json({
        success: true,
        message: "Order delivered successfully!",
        data: order,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error delivering item",
      });
    }
  };

const allUsers = async (req, res) => {
    try {
      const users = await User.find();
  
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error fetching users",
      });
    }
}
export {checkout, getOrdersHistory, deliverItem, allUsers, cancelOrder, updateOTP};