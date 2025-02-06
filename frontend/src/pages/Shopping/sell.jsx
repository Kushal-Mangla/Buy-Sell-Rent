import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../components/ui/use-toast";
import ImageUpload from "../../components/admin-view/image-upload";
import CommonForm from "../Additional/Form";
import { addProductFormElements } from "./../../form_create/index";
import { addNewProduct, fetchAllProducts } from "../../store/Admin/products/index";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  seller: "",
  sellerId: null,
};

function SellProducts() {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Get current user's information from Redux state
  const currentUser = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Automatically set seller and sellerId from current user
    const productData = {
      ...formData,
      image: uploadedImageUrl,
      seller: user?.fname + " " + user?.lname || "Unknown Seller",
      sellerId: user?.id || null,
    };
    console.log("Product Data", productData);
    dispatch(addNewProduct(productData)).then((data) => {
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setImageFile(null);
        toast({
          title: "Product added successfully",
          success: "success",
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <ImageUpload 
        imageFile={imageFile} 
        setImageFile={setImageFile} 
        uploadedImageUrl={uploadedImageUrl} 
        setUploadedImageUrl={setUploadedImageUrl} 
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
      />
      <div className="mt-6">
        <CommonForm
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          buttonText="Add Product"
          formControls={addProductFormElements}
        />
      </div>
    </div>
  );
}

export default SellProducts;