import React, { useState } from 'react';
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import { addToCart } from '../../store/shop/Cart';
import { useSelector } from 'react-redux';
import { fetchCartItems } from "../../store/shop/Cart";
import { useDispatch } from "react-redux";

function ProductDetails({ open, setopen, productDetails }) {
    const [reviews, setReviews] = useState(productDetails?.reviews || []);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [cartAdded, setCartAdded] = useState(false);
    const defaultRating = productDetails?.averageReview || 4;
    const handleDialogClose = () => setopen(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const handleAddReview = () => {
        if (newReview.trim() && rating > 0) {
            const review = {
                text: newReview,
                rating: rating,
                user: 'Current User',
                date: new Date().toLocaleDateString()
            };
            setReviews([...reviews, review]);
            setNewReview('');
            setRating(0);
        }
    };

    const handleAddToCart = () => {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
        console.log(productDetails);
        console.log("USERID", user.id);
        dispatch(addToCart({ userId: user.id, productId:productDetails._id, quantity: 1 })).then((data) => {
            // console.log(data);
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                // toast({
                //     title: "Product added to cart successfully",
                // });
                // alert("Product added to cart successfully");
            }
        });
    };

    const calculateAverageRating = () => {
      if (reviews.length === 0) return defaultRating;
      const total = reviews.reduce((acc, review) => acc + review.rating, 0);
      return (total / reviews.length).toFixed(1);
  };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-10 p-0 overflow-hidden max-w-[90vw] sm:max-w-[80vw] lg:max-w-[1000px] rounded-2xl">
                {/* Image Section */}
                <div className="bg-gray-100 flex items-center justify-center p-8">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="max-h-[500px] w-full object-contain rounded-lg shadow-lg"
                    />
                </div>

                {/* Product Details Section */}
                <div className="p-8 space-y-6">
                    {/* Product Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {productDetails?.title}
                        </h1>
                        <div className="flex items-center gap-2 mb-4 text-gray-600">
                            <span>Sold by: {productDetails?.seller || 'Unknown Seller'}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    <Star 
                                        key={index} 
                                        className={`w-5 h-5 fill fill-current ${
                                            index < Math.round(calculateAverageRating()) 
                                                ? 'text-yellow-500' 
                                                : 'text-gray-300'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                {calculateAverageRating()} ({reviews.length} reviews)
                            </span>
                        </div>
                        <p className="text-gray-600 text-base">
                            {productDetails?.description}
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center gap-4">
                        <p className={`text-3xl font-bold ${
                            productDetails?.salePrice > 0 
                                ? 'text-gray-400 line-through' 
                                : 'text-primary'
                        }`}>
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 && (
                            <p className="text-3xl font-bold text-primary">
                                ${productDetails?.salePrice}
                            </p>
                        )}
                    </div>

                    {/* Add to Cart */}
                    <Button 
                        onClick={handleAddToCart}
                        className="w-full py-3 flex items-center justify-center gap-2 transition-all duration-300"
                    >
                        {cartAdded ? (
                            <>
                                <Check className="w-5 h-5" />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </>
                        )}
                    </Button>

                    {/* Reviews Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                        <div className="space-y-4 max-h-48 overflow-y-auto pr-3">
                            {reviews.map((review, index) => (
                                <div key={index} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium text-gray-800">{review.user}</span>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <div className="flex">
                                      {[...Array(5)].map((_, index) => (
                                          <Star 
                                              key={index} 
                                              className={`w-5 h-5 ${
                                                  index < Math.round(calculateAverageRating()) 
                                                      ? 'text-yellow-500 fill-yellow-500' // Added fill 
                                                      : 'text-gray-300'
                                              }`} 
                                          />
                                      ))}
                                    </div>
                                    <p className="text-gray-600">{review.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Review */}
                        <div className="mt-6">
                            <h4 className="text-lg font-medium mb-3">Write a Review</h4>
                            <div className="flex gap-2 mb-3">
                                {[...Array(5)].map((_, index) => (
                                    <Star 
                                        key={index} 
                                        onClick={() => setRating(index + 1)}
                                        className={`w-6 h-6 cursor-pointer transition-colors ${
                                            index < rating 
                                                ? 'text-yellow-500' 
                                                : 'text-gray-300 hover:text-yellow-300'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <Textarea 
                                placeholder="Share your experience..."
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                className="mb-3 border-gray-300 focus:border-primary"
                            />
                            <Button 
                                onClick={handleAddReview}
                                disabled={!newReview.trim() || rating === 0}
                                className="w-full"
                            >
                                Submit Review
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetails;