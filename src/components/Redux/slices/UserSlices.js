import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call using createAsyncThunk
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/user-details`);
    return response.data;
});

export const fetchUserDetailsByIds = createAsyncThunk("users/fetch-details", async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/shopify/users/69328ff18736b56002ef83df`);
    return response.data;
});
const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: null,
        userDetails: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUserDetailsByIds.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserDetailsByIds.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetailsByIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;
