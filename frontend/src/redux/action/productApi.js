// Redux async thunks for product and category backend APIs
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

// Fetch products page from backend
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/get?page=${page}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load products"
      );
    }
  }
);

// Fetch all product pages for catalog search & filtering
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const firstRes = await axios.get(`${API_BASE_URL}/product/get?page=1`, {
        withCredentials: true,
      });
      const firstData = firstRes.data;
      if (!firstData?.success || !Array.isArray(firstData.data)) {
        throw new Error(firstData?.message || "Failed to load products");
      }

      const allProducts = [...firstData.data];
      const totalPages = Math.max(1, Number(firstData.totalPages) || 1);

      for (let p = 2; p <= totalPages; p += 1) {
        const nextRes = await axios.get(`${API_BASE_URL}/product/get?page=${p}`, {
          withCredentials: true,
        });
        if (nextRes.data?.success && Array.isArray(nextRes.data?.data)) {
          allProducts.push(...nextRes.data.data);
        }
      }

      return allProducts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load all products"
      );
    }
  }
);

// Fetch single product details by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/product/getp/${encodeURIComponent(id)}`,
        { withCredentials: true }
      );
      if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message || "Product not found");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not load product details"
      );
    }
  }
);

// Fetch active categories list
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/get`, {
        withCredentials: true,
      });
      const data = response.data;
      const categories = Array.isArray(data?.data)
        ? data.data.filter((category) => category.isActive !== false)
        : [];
      return categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load categories"
      );
    }
  }
);
