import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'



export const fetchActivityHistory = createAsyncThunk("admin/fetchActivityHistory", async (adminIdLocal) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/activity/transactions/${adminIdLocal}`)
    return response.data
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        activityHistory: [],
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
    }
});
export default adminSlice.reducer;