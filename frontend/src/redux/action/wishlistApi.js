// Redux async thunks for customer wishlist backend APIs
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCustomerAccessToken } from "../../utils/customerSession";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = getCustomerAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch user's wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wish/get`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      const data = response.data?.data || [];
      return data.filter((item) => item.product);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not load wishlist"
      );
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/wish/addtowish`,
        { product: productId },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not add to wishlist"
      );
    }
  }
);

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/wish/remove/${itemId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not remove item from wishlist"
      );
    }
  }
);

// Move wishlist item to cart
export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/wish/movetocart/${itemId}`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return { itemId, message: response.data?.message || "Moved to cart" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not move to cart"
      );
    }
  }
);
