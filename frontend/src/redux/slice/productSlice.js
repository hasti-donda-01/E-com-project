// Redux slice for products and categories
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductById,
  fetchProducts,
} from "../action/productApi";

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  productDetailStatus: "idle",
  productDetailError: null,
  categoriesStatus: "idle",
  categoriesError: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Clear product details on unmount
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productDetailStatus = "idle";
      state.productDetailError = null;
    },
    // Set products manually if needed
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Paginated products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload?.data || action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // All products
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailStatus = "loading";
        state.productDetailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailStatus = "failed";
        state.productDetailError = action.payload || action.error.message;
      })

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentProduct, setProducts } = productSlice.actions;
export default productSlice.reducer;
