import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API call using createAsyncThunk


export const fetchConsultants = createAsyncThunk(
    "consultants/fetch",
    async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/api-find-consultant`,
            {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                params: {
                    _t: Date.now(), // extra cache-buster
                },
            }
        );

        return response.data;
    }
);


export const deleteConsultantById = createAsyncThunk("consultants/delete", async (id) => {
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/delete-consultant/${id}`);
    return response.data;
});


const consultantSlice = createSlice({
    name: "consultants",
    initialState: {
        consultants: [],
        loading: false,
        error: null,
        deletedConsultant: null,
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
            })
            .addCase(deleteConsultantById.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteConsultantById.fulfilled, (state, action) => {
                state.loading = false;
                state.deletedConsultant = action.payload;
            })
            .addCase(deleteConsultantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default consultantSlice.reducer;
