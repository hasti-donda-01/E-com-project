// Redux async thunks for customer orders backend APIs
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

// Fetch customer orders history from backend
export const fetchCustomerOrders = createAsyncThunk(
  "order/fetchCustomerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/orders`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (!response.data?.success || !Array.isArray(response.data?.data)) {
        throw new Error(response.data?.message || "Could not load orders");
      }

      const orders = response.data.data;

      // Extract IDs for unpopulated products
      const unpopulatedIds = [
        ...new Set(
          orders
            .map((order) => {
              if (order.product && typeof order.product === "object" && order.product.image) {
                return null;
              }
              return typeof order.product === "string" ? order.product : order.product?._id || null;
            })
            .filter(Boolean)
        ),
      ];

      // Fetch details for unpopulated products
      const productMap = {};
      if (unpopulatedIds.length > 0) {
        await Promise.all(
          unpopulatedIds.map(async (pid) => {
            try {
              const res = await axios.get(`${API_BASE_URL}/product/getp/${pid}`, {
                withCredentials: true,
              });
              if (res.data?.success && res.data?.data) {
                productMap[pid] = res.data.data;
              }
            } catch {
              // Ignore individual lookup errors
            }
          })
        );
      }

      // Merge populated products into orders
      const enrichedOrders = orders.map((order) => {
        if (order.product && typeof order.product === "object" && order.product.image) {
          return order;
        }
        const pid = typeof order.product === "string" ? order.product : order.product?._id;
        return {
          ...order,
          product: productMap[pid] || order.product,
        };
      });

      return enrichedOrders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load orders"
      );
    }
  }
);
