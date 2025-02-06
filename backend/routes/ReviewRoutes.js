import express from 'express';
import { submitReview, getSellerReviews } from '../controllers/Shopping/reviewControllers.js';

const router = express.Router();

router.post('/reviews', submitReview);
router.get('/seller/:sellerId', getSellerReviews);

export default router;

