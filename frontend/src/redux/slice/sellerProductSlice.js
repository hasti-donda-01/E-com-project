// Redux slice for supplier product inventory management
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteSellerProduct,
  fetchSellerProducts,
  updateSellerProduct,
} from "../action/sellerProductApi";

const initialState = {
  products: [],
  page: 1,
  totalPages: 1,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  notice: "",
  saving: false,
  editError: "",
};

export const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearNotice: (state) => {
      state.notice = "";
      state.editError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Delete product
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId
        );
        state.notice = action.payload.warning;
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Update product
      .addCase(updateSellerProduct.pending, (state) => {
        state.saving = true;
        state.editError = "";
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        state.products = state.products.map((p) =>
          p._id === updated._id ? { ...p, ...updated } : p
        );
        state.notice = "Product updated successfully.";
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.saving = false;
        state.editError = action.payload || action.error.message;
      });
  },
});

export const { setPage, clearNotice } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
