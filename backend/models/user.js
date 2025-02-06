import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    // required: true,
  },
  lname: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  phone: {
    type: Number,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  reviews: [reviewSchema]
});

const User = mongoose.model("User", userSchema);

export default User;