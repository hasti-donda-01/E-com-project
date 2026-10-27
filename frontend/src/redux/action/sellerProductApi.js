// Redux async thunks for supplier product management APIs
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

// Fetch products owned by the supplier
export const fetchSellerProducts = createAsyncThunk(
  "sellerProduct/fetchSellerProducts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sellerp/getmyproducts?page=${page}`,
        { withCredentials: true }
      );
      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Could not load products");
      }
      const pageData = Array.isArray(response.data?.data) ? response.data.data : [];
      const products = Array.isArray(pageData[0]) ? pageData[0] : [];
      const totalPagesText = String(pageData[1] || "");
      const totalPages = Math.max(1, Number(totalPagesText.match(/\d+/)?.[0] || 1));
      return { products, totalPages, page };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not load products"
      );
    }
  }
);

// Delete supplier product
export const deleteSellerProduct = createAsyncThunk(
  "sellerProduct/deleteSellerProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/product/delete/${productId}`,
        { withCredentials: true }
      );
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to delete product");
      }
      return { productId, warning: response.data?.warning || "Product deleted successfully." };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete product"
      );
    }
  }
);

// Update supplier product price and stock
export const updateSellerProduct = createAsyncThunk(
  "sellerProduct/updateSellerProduct",
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/product/update/${productId}`,
        data,
        { withCredentials: true }
      );
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to update product");
      }
      return response.data?.data || { _id: productId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update product"
      );
    }
  }
);
