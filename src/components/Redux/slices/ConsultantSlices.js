import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call using createAsyncThunk
export const fetchConsultants = createAsyncThunk("consultants/fetch", async () => {
    const response = await axios.get("http://localhost:5001/api-consultant/api-find-consultant");
    return response.data;
});

const consultantSlice = createSlice({
    name: "consultants",
    initialState: {
        consultants: [],
        loading: false,
        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchConsultants.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConsultants.fulfilled, (state, action) => {
                state.loading = false;
                state.consultants = action.payload;
            })
            .addCase(fetchConsultants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default consultantSlice.reducer;
