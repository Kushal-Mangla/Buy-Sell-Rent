import {deleteCartItem} from '../../backend/controllers/Shopping/Cart-control.js';
import {fetchCartItems} from '../../backend/controllers/Shopping/Cart-control.js';
import {addToCart} from '../../backend/controllers/Shopping/Cart-control.js';
import {updateCartItemQty} from '../../backend/controllers/Shopping/Cart-control.js';
import { clearCart } from '../../backend/controllers/Shopping/Cart-control.js';
import express from 'express';

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems);
router.delete('/:userId/:productId', deleteCartItem);
router.put('/update-cart', updateCartItemQty);
router.get('/:userId/clear', clearCart);

export default router;