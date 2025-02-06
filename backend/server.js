import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import env from 'dotenv';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/UserRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
import ShopRoutes from './routes/ShopRoutes.js';
import CartRoutes from './routes/CartRoutes.js';
import OrderRoutes from './routes/OrderRoutes.js';
import ReviewRoutes from './routes/ReviewRoutes.js'

env.config();

// Create express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log("MONGODB Connected"))
.catch((error) => console.log("Error in connecting to MongoDB", error));

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Pragma", "Cache-Control", "Expires"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/admin/products", ProductRoutes);
app.use("/api/shop", ShopRoutes);
app.use("/api/shopping-home/cart", CartRoutes);
app.use("/api/shopping-home/order", OrderRoutes);
app.use("/api/shopping-home/order-history", ReviewRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});