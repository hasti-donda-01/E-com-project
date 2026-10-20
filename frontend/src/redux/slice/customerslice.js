import { createSlice } from "@reduxjs/toolkit"
import { addCustomer, verifyCustomer } from "../action/customerApi"

const initialState = {
    status: "idle",
    error: null,
    message: null,
}

export const customerslice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCustomer.pending, (state) => {
                state.status = "loading"
                state.error = null
                state.message = null
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.message = action.payload.message
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || action.error.message
            })
            .addCase(verifyCustomer.pending, (state) => {
                state.status = "loading"
                state.error = null
                state.message = null
            })
            .addCase(verifyCustomer.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.message = action.payload.message
            })
            .addCase(verifyCustomer.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || action.error.message
            })
    },
})
