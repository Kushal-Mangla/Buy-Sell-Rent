import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    totalStock: {
        type: Number,
        required: true,
    },
    averageReview: {
        type: Number,
    },
    seller: {
        type: String,
    },
    sellerId: {
        type: String,
    }
},{timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;