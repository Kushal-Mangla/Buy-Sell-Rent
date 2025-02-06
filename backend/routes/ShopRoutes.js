import {getAllFilteredProducts} from "../controllers/Shopping/ShoppingProducts.js";
import {fetchProductDetails} from "../controllers/Shopping/ShoppingProducts.js";

import express from "express";
const router = express.Router();

router.get("/get-filteredProducts", getAllFilteredProducts);
router.get("/get-productDetails/:productId", fetchProductDetails);

export default router;
