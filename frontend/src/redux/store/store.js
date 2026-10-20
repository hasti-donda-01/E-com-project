import { configureStore } from "@reduxjs/toolkit";
import { customerslice } from "../slice/customerslice";

export const store = configureStore({
    reducer: {
        customer: customerslice.reducer,
    },
})