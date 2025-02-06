import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  otp: {
    type: String, // Hashed OTP
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the OTP before saving
// orderSchema.pre("save", async function (next) {
//   if (this.isModified("otp")) {
//     this.otp = bcrypt.hash(this.otp, 10);
//   }
//   next();
// });

// Method to cancel the order
orderSchema.methods.cancelOrder = async function () {
  if (this.status === "completed") {
    throw new Error("Cannot cancel a completed order");
  }
  this.status = "cancelled";
  await this.save();
};

const Order = mongoose.model("Order", orderSchema);

export default Order;