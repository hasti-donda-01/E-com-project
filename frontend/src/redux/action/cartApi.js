// Redux async thunks for customer shopping cart backend APIs
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

// Fetch user's cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/getcartofuser`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not load cart items"
      );
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/addtocart`,
        { product: productId, quantity },
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
        error.response?.data?.message || error.message || "Could not add item to cart"
      );
    }
  }
);

// Update item quantity in cart
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/cart/updatequantity/${itemId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          withCredentials: true,
        }
      );
      return { itemId, quantity, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not update quantity"
      );
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/removeproductfromcart/${itemId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Could not remove item"
      );
    }
  }
);
