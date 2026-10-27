// Central Redux store configuring customer, product, cart, wishlist, order, and seller reducers
import { configureStore } from "@reduxjs/toolkit";
import { customerslice } from "../slice/customerslice";
import { productSlice } from "../slice/productSlice";
import { cartSlice } from "../slice/cartSlice";
import { wishlistSlice } from "../slice/wishlistSlice";
import { orderSlice } from "../slice/orderSlice";
import { sellerProductSlice } from "../slice/sellerProductSlice";

export const store = configureStore({
    reducer: {
        customer: customerslice.reducer,
        product: productSlice.reducer,
        cart: cartSlice.reducer,
        wishlist: wishlistSlice.reducer,
        order: orderSlice.reducer,
        sellerProduct: sellerProductSlice.reducer,
    },
});