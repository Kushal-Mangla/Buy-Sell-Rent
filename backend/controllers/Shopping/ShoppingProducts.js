import Product from '../../models/product.js';

const getAllFilteredProducts = async (req, res) => {
    try {

        const { category=[] } = req.query;
        // if(category.length) {
        //     filter.category = { $in: category };
        // }
        // console.log("category",category);
        const categoryArray = Array.isArray(category) ? category : [category];
        const filter = {};
        if (categoryArray.length > 0) {
            filter.category = { $in: categoryArray };
        }
        // console.log("filterDb",filter);   
        const products = await Product.find(filter);

        // console.log("products",products);
        res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}
const fetchProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

export { getAllFilteredProducts, fetchProductDetails };
