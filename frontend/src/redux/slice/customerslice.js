// Redux slice for customer auth state (OTP verification and user session)
import { createSlice } from "@reduxjs/toolkit"
import { addCustomer, fetchCustomerSession, logoutCustomer, verifyCustomer } from "../action/customerApi"

const initialState = {
    user: null,
    status: "idle",
    error: null,
    message: null,
    sessionStatus: "idle",
}

export const customerslice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        clearCustomerState: (state) => {
            state.user = null
            state.status = "idle"
            state.error = null
            state.message = null
            state.sessionStatus = "idle"
        },
    },
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
                if (action.payload.user) {
                    state.user = action.payload.user
                }
            })
            .addCase(verifyCustomer.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload || action.error.message
            })
            .addCase(fetchCustomerSession.pending, (state) => {
                state.sessionStatus = "loading"
            })
            .addCase(fetchCustomerSession.fulfilled, (state, action) => {
                state.sessionStatus = "succeeded"
                state.user = action.payload
            })
            .addCase(fetchCustomerSession.rejected, (state) => {
                state.sessionStatus = "failed"
                state.user = null
            })
            .addCase(logoutCustomer.fulfilled, (state) => {
                state.user = null
                state.sessionStatus = "idle"
            })
            .addCase(logoutCustomer.rejected, (state) => {
                state.user = null
            })
    },
})

export const { clearCustomerState } = customerslice.actions
export default customerslice.reducer

