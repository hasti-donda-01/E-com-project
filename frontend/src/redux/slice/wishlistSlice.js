// Redux slice for customer wishlist
import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, fetchWishlist, moveToCart, removeFromWishlist } from "../action/wishlistApi";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  notice: "",
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistNotice: (state) => {
      state.notice = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.notice = action.payload?.message || "Added to wishlist";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
        state.notice = "Item removed from wishlist";
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Move to cart
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload.itemId);
        state.notice = action.payload.message;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearWishlistNotice } = wishlistSlice.actions;
export default wishlistSlice.reducer;
