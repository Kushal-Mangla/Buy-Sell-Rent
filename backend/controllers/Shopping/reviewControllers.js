import User from '../../models/user.js';
import Order from '../../models/order.js';

const submitReview = async (req, res) => {
    try {
        const { sellerId, rating, comment, orderId, userId } = req.body;
        const reviewerId = userId; // Assuming you have user info in request after authentication

        // Validate the order exists and belongs to the reviewer
        const order = await Order.findOne({
            _id: orderId,
            buyerId: reviewerId,
            status: 'completed'
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not eligible for review'
            });
        }

        // Check if review already exists
        const seller = await User.findById(sellerId);
        // const existingReview = seller.reviews.find(
        //     review => review.orderId.toString() === orderId.toString()
        // );

        // if (existingReview) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Review already exists for this order'
        //     });
        // }

        // We cn add multiple reviews for the user

        // Create and add the review
        const newReview = {
            reviewerId,
            rating,
            comment,
            orderId
        };

        seller.reviews.push(newReview);
        await seller.save();

        // Update order to mark that it has been reviewed
        order.hasReview = true;
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: newReview
        });

    } catch (error) {
        console.error('Error in submitReview:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await User.findById(sellerId)
            .populate('reviews.reviewerId', 'fname lname');

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        // Calculate average rating
        const averageRating = seller.reviews.reduce((acc, review) => 
            acc + review.rating, 0) / seller.reviews.length;

        res.status(200).json({
            success: true,
            reviews: seller.reviews,
            averageRating: averageRating || 0,
            totalReviews: seller.reviews.length
        });

    } catch (error) {
        console.error('Error in getSellerReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export {submitReview, getSellerReviews}