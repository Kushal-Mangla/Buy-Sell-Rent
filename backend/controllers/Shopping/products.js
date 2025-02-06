import { handleImageUpload } from '../../Cloudinary/index.js';
import Product from '../../models/product.js';
import User from '../../models/user.js';

const ImageUploadHandler = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await handleImageUpload(url);
        // console.log(result);

        res.status(200).json({ 
            success: true,
            message: "Image uploaded successfully",
            data: result
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ 
            success: false,
            message: "Something went wrong" });
    }
}

// add a new product
const addProduct = async (req, res) => {
    try {
        let { image, title, description, category, price, salePrice, totalStock, averageReview, seller, sellerId } = req.body;
        // console.log("Hello",req.body);
        // Captialize the first letter of category
        category = category.charAt(0).toUpperCase() + category.slice(1);
        const product = new Product({
            image,
            title,
            description,
            category,
            price,
            salePrice,
            totalStock,
            averageReview,
            seller,
            sellerId
        });
        await product.save();
        // console.log("Product",product);
        res.status(201).json({ 
            success: true, 
            message: "Product added successfully",
            data: product });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


// fetch all products
const getProducts = async (req, res) => {
    try{
        const listofproducts = await Product.find();
        res.status(200).json({ 
            success: true, 
            message: "All products fetched successfully",
            data: listofproducts });
    }
    catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
}
// edit a product
const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { image, title, description, category, price, salePrice, totalStock, averageReview } = req.body;
        const product = {
            image,
            title,
            description,
            category,
            price,
            salePrice,
            totalStock,
            averageReview,
        };
        const findProduct = await Product.findById(id);
        if(!findProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        product.image = image || findProduct.image;
        product.title = title || findProduct.title;
        product.description = description || findProduct.description;
        product.category = category || findProduct.category;
        product.price = price || findProduct.price;
        product.salePrice = salePrice || findProduct.salePrice;
        product.totalStock = totalStock || findProduct.totalStock;
        product.averageReview = averageReview || findProduct.averageReview;
        const updatedProduct = await
        Product.findByIdAndUpdate(id, product, { new: true });

        res.status(200).json({ 
            success: true, 
            message: "Product updated successfully",
            data: updatedProduct 
        });

    }
    catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
}


// delete a product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const findProduct = await Product.findByIdAndDelete(id);
        if(!findProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    }
    catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ 
            success: true, 
            message: "All users fetched successfully",
            data: users 
        });
    }
    catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const findUser = await User.findByIdAndDelete(id);
        if(!findUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "User deleted successfully" 
        });
    }
    catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
}

export { ImageUploadHandler, addProduct, getProducts, editProduct, deleteProduct, getAllUsers, deleteUser };