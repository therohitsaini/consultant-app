import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getAppBridgeToken } from '../../../utils/getAppBridgeToken'




export const fetchAdminDetails = createAsyncThunk("admin/fetchAdminDetails", async ({ adminIdLocal, app }) => {
    console.log("adminIdLocal", adminIdLocal)
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/admin/${adminIdLocal}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data?.data
})

export const fetchActivityHistory = createAsyncThunk("admin/fetchActivityHistory", async ({ adminIdLocal, page, limit, type = 'all', app, searchQuery }) => {
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/activity/transactions/${adminIdLocal}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page,
            limit,
            type,
            searchQuery
        }
    })
    return response.data
})

export const fetchWalletHistory = createAsyncThunk("admin/fetchWalletHistory", async ({ adminIdLocal, page = 1, limit = 10, app, searchQuery }) => {
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/user/consultant/${adminIdLocal}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            page,
            limit,
            search: searchQuery
        }
    })
    return response.data

})

export const fetchShopAllUsers = createAsyncThunk("admin/fetchShopAllUsers", async ({ adminIdLocal, app }) => {
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/shop/all-user/${adminIdLocal}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
})
export const fetchShopAllConsultants = createAsyncThunk("admin/fetchShopAllConsultants", async ({ adminIdLocal, app }) => {
    const token = await getAppBridgeToken(app);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/shop/all-consultant/${adminIdLocal}`, {
        headers: {
            Authorization: `Bearer ${token}`
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
        shopAllUsers: [],
        shopAllConsultants: [],
        adminDetails_: [],
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
            .addCase(fetchShopAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShopAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.shopAllUsers = action.payload;
            })
            .addCase(fetchShopAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchShopAllConsultants.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShopAllConsultants.fulfilled, (state, action) => {
                state.loading = false;
                state.shopAllConsultants = action.payload;
            })
            .addCase(fetchShopAllConsultants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAdminDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.adminDetails_ = action.payload;
            })
            .addCase(fetchAdminDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});
export default adminSlice.reducer;