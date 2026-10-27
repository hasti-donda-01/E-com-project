// Redux slice for customer shopping cart
import { createSlice } from "@reduxjs/toolkit";
import { addToCart, fetchCart, removeFromCart, updateQuantity } from "../action/cartApi";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  notice: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.notice = "";
    },
    setCartItems: (state, action) => {
      state.items = action.payload || [];
      state.status = "succeeded";
      state.error = null;
    },
    setCartNotice: (state, action) => {
      state.notice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.notice = action.payload?.message || "Item added to cart";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Update quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { itemId, quantity } = action.payload;
        const item = state.items.find((i) => i._id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCartState, setCartItems, setCartNotice } = cartSlice.actions;
export default cartSlice.reducer;
