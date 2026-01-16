import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { useAppBridge } from '../../createContext/AppBridgeContext'
import { getAppBridgeToken } from '../../../utils/getAppBridgeToken'



export const fetchActivityHistory = createAsyncThunk("admin/fetchActivityHistory", async ({ adminIdLocal, page, limit = 10, type = 'all' }) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/activity/transactions/${adminIdLocal}?page=${page}&limit=${limit}?type=${type}`, {
        params: {
            page,
            limit,
            type
        }
    })
    return response.data
})

export const fetchWalletHistory = createAsyncThunk("admin/fetchWalletHistory", async ({ adminIdLocal, page = 1, limit = 10, app }) => {
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/user/consultant/${adminIdLocal}?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page,
            limit
        }
    })

    return response.data
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        activityHistory: [],
        walletHistory: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActivityHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.activityHistory = action.payload;
            })
            .addCase(fetchActivityHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchWalletHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWalletHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.walletHistory = action.payload;
            })
            .addCase(fetchWalletHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});
export default adminSlice.reducer;