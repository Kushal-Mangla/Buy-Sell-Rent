import React from "react";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PackageCheck, PackageX } from "lucide-react";

function ShoppingTile({ product, handleGetProductDetails, handleAddToCart }) {
    const getStockStatusColor = (stock) => {
        if (stock > 2) return "text-green-600 bg-green-50";
        if (stock > 0) return "text-yellow-600 bg-yellow-50";
        return "text-red-600 bg-red-50";
    };

    const getStockStatusText = (stock) => {
        if (stock > 2) return "In Stock";
        if (stock > 0) return "Low Stock";
        return "Out of Stock";
    };

    return (
        <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img 
                        src={product?.image} 
                        alt={product?.title} 
                        className="w-full h-[300px] object-cover rounded-t-lg" 
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${getStockStatusColor(product?.totalStock)}`}>
                        {product?.totalStock > 0 ? (
                            <div className="flex items-center gap-1">
                                <PackageCheck className="w-4 h-4" />
                                {getStockStatusText(product?.totalStock)}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <PackageX className="w-4 h-4" />
                                {getStockStatusText(product?.totalStock)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[16px] text-muted-foreground">
                        {product?.category}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        Available:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product?.totalStock > 2 
                            ? "bg-green-100 text-green-800" 
                            : product?.totalStock > 0 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-red-100 text-red-800"
                    }`}>
                        {product?.totalStock} units
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span 
                        className={`${
                            product?.salePrice > 0 ? "line-through" : ""
                        } text-lg font-semibold text-primary`}
                    >
                        ${product?.price}
                    </span>
                    {product?.salePrice > 0 ? (
                        <span className="text-lg font-semibold text-primary">
                            ${product?.salePrice}
                        </span>
                    ) : null}
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    onClick={() => handleAddToCart(product?._id)} 
                    className="w-full"
                    disabled={product?.totalStock === 0}
                >
                    {product?.totalStock > 0 ? "Add to cart" : "Out of Stock"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingTile;