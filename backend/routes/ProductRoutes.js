import express from 'express';
import {ImageUploadHandler} from '../controllers/Shopping/products.js';
import { upload } from '../Cloudinary/index.js';
import {addProduct} from '../controllers/Shopping/products.js';
import {getProducts} from '../controllers/Shopping/products.js';
import { deleteProduct } from '../controllers/Shopping/products.js';
import { editProduct } from '../controllers/Shopping/products.js';
import { getAllUsers } from '../controllers/Shopping/products.js';
import { deleteUser } from '../controllers/Shopping/products.js';

const router = express.Router();

router.post('/upload-image', upload.single('my_file'), ImageUploadHandler);
router.post('/add-product', addProduct);
router.get('/get-products', getProducts);
router.delete('/delete-product/:id', deleteProduct);
router.put('/edit-product/:id', editProduct);
router.get("/users/all-users", getAllUsers);
router.delete('/delete-user/:id', deleteUser);

export default router;