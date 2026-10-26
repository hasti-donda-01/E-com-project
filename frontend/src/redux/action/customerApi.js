import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { storeCustomerAccessToken } from '../../utils/customerSession'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-com-project-b3ci.onrender.com/api'

export const addCustomer = createAsyncThunk("customer/addCustomer", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL.replace(/\/$/, '')}/seller/customer/send-otp`,
            data,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || error.message || 'Could not save your phone number'
        )
    }
})

export const verifyCustomer = createAsyncThunk("customer/verifyCustomer", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL.replace(/\/$/, '')}/seller/customer/verify-otp`,
            data,
            { withCredentials: true }
        )
        if (!response.data?.token) {
            throw new Error('Customer login did not return an access token.')
        }
        storeCustomerAccessToken(response.data.token)
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || error.message || 'Could not verify OTP'
        )
    }
})
