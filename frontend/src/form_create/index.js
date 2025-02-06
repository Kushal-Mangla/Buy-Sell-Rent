import { path } from "d3";

export const RegisterInfo = [
  {
    name: "fname",
    label: "fName",
    type: "text",
    placeholder: "Enter your first name",
    componentType: "input",
  },
  {
    name: "lname",
    label: "lName",
    type: "text",
    placeholder: "Enter your last name",
    componentType: "input",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    componentType: "input",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    componentType: "input",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Enter your phone number",
    componentType: "input",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    componentType: "input",
  },
];

export const LoginInfo = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    componentType: "input",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "electronics", label: "Electronics" },
      { id: "groceries", label: "Groceries" },
      { id: "stationary", label: "Stationary" },
      { id: "clothing", label: "Clothing" },
      { id: "accessories", label: "Accessories" },
      { id: "other", label: "Other" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const MenuShoppingItems = [
  {
    id: "home",
    label: "Home",
    path: "/shopping-home/listing",
  },
  {
    id: "Sell",
    label: "Sell",
    path: "/shopping-home/sell",
  },
  {
    id: "Orders-History",
    label: "Orders History",
    path: "/shopping-home/orders-history",
  },
  {
    id: "Deliver-Items",
    label: "Deliver Items",
    path: "/shopping-home/deliver-items",
  },
  {
    id: "Support",
    label: "Support",
    path: "/shopping-home/Support"
  }
];

export const filterOptions = {
  category: [
    { id: "Electronics", label: "Electronics" },
    { id: "Groceries", label: "Groceries" },
    { id: "Stationary", label: "Stationary" },
    { id: "Clothing", label: "Clothing" },
    { id: "Accessories", label: "Accessories" },
    { id: "Other", label: "Other" },
  ],
};