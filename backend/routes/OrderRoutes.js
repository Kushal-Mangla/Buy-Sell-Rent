import { checkout } from "../controllers/Shopping/Order.js";
import { deliverItem, getOrdersHistory } from "../controllers/Shopping/Order.js";
import { allUsers } from "../controllers/Shopping/Order.js";
import { cancelOrder } from "../controllers/Shopping/Order.js";
import express from "express";
import { updateOTP } from "../controllers/Shopping/Order.js";

const router = express.Router();

router.post("/checkout", checkout);
router.get("/orders-history/:userId", getOrdersHistory);
router.post("/deliver-item", deliverItem);
router.get("/all-users", allUsers);
router.patch("/orders/:id/cancel", cancelOrder);
router.patch("/orders/:id/update-otp", updateOTP);

export default router;