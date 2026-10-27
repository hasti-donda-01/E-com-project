// Redux async thunks for customer authentication, session, and OTP verification
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { clearCustomerAccessToken, getCustomerAccessToken, storeCustomerAccessToken } from '../../utils/customerSession'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-com-project-b3ci.onrender.com/api'

// Request OTP for phone login
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

// Verify OTP and persist access token
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

// Fetch active customer session
export const fetchCustomerSession = createAsyncThunk(
    "customer/fetchCustomerSession",
    async (_, { rejectWithValue }) => {
        try {
            const token = getCustomerAccessToken();
            const response = await axios.get(
                `${API_BASE_URL.replace(/\/$/, '')}/seller/session`,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    withCredentials: true,
                }
            );
            if (!response.data?.success || !response.data?.data) {
                throw new Error("Invalid session response");
            }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to load session"
            );
        }
    }
);

// Sign out customer
export const logoutCustomer = createAsyncThunk(
    "customer/logoutCustomer",
    async (_, { rejectWithValue }) => {
        try {
            const token = getCustomerAccessToken();
            const response = await axios.post(
                `${API_BASE_URL.replace(/\/$/, '')}/seller/logout`,
                {},
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    withCredentials: true,
                }
            );
            clearCustomerAccessToken();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Logout failed"
            );
        }
    }
);

