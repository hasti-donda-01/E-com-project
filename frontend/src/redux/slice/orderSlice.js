// Redux slice for customer order history
import { createSlice } from "@reduxjs/toolkit";
import { fetchCustomerOrders } from "../action/orderApi";

const initialState = {
  orders: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload || [];
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
