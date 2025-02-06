import React, { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useState } from "react";
import ImageUpload from "../../components/admin-view/image-upload";
import { addNewProduct } from "../../store/Admin/products/index";
import { useToast } from "../../components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";

import CommonForm from "../Additional/Form";
import { addProductFormElements } from "./../../form_create/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/Admin/products/index";
import Product_Card from "./product-card";
import { editProduct } from "../../store/Admin/products/index";
import { deleteProduct } from "../../store/Admin/products/index";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {

  const [openProductsBox, setOpenProductsBox] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const {productList} = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const { toast } = useToast();


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FormData",formData);
    
    currentEditedId !== null ? 
    dispatch(editProduct({
      id: currentEditedId,
      formData
    })).then((data) => {
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setImageFile(null);
        setOpenProductsBox(false);
        toast(
          {title: "Product updated successfully",
          success: "success",
          }
        );
        }
    }) : 

    dispatch(addNewProduct(
      {
        ...formData,
        image: uploadedImageUrl,
      }
    )).then((data) => {
      console.log("Data",data);
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setImageFile(null);
        setOpenProductsBox(false);
        toast(
          {title: "Product added successfully",
          success: "success",
        }
        );
      }
    });
  }

  useEffect(() => {
    // fetch all products
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function handleDeleteProduct(id) {
    console.log("Delete",id);
    dispatch(deleteProduct(id)).then((data) => {
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        toast(
          {
            title: "Product deleted successfully",
            success: "success",
          }
        );
      }
    });
  }

  console.log("productList",productList);
  console.log("ImageUrl", uploadedImageUrl);

    return (
        <Fragment>
          <div className="mb-5 w-full flex justify-end">
           <Button onClick={()=> setOpenProductsBox(true)}> Add New Product </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productList && productList.length > 0 ? (
              productList.map((product) => (
                <Product_Card 
                key={product._id} 
                setOpenProductsBox={setOpenProductsBox} 
                setFormData={setFormData} 
                product={product} 
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
            <Sheet 
            open={openProductsBox}
            onOpenChange={() => {
              setOpenProductsBox(false);
              setFormData(initialFormData);
              setCurrentEditedId(null);
            }
            }>
            <SheetContent side="right" className="overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  {"Add New Product"}
                </SheetTitle>
              </SheetHeader>
              <ImageUpload imageFile={imageFile} 
                setImageFile={setImageFile} 
                uploadedImageUrl={uploadedImageUrl} 
                setUploadedImageUrl={setUploadedImageUrl} 
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isEditMode={currentEditedId !== null}
              />
              <div className="py-6">
                <CommonForm
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Add Product"}
                formControls={addProductFormElements}
                ></CommonForm>
              </div>
            </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminProducts;