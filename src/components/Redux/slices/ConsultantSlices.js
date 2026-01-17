import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAppBridgeToken } from "../../../utils/getAppBridgeToken";

// API call using createAsyncThunk


export const fetchConsultants = createAsyncThunk(
    "consultants/fetch",
    async (adminIdLocal, app) => {
        console.log("adminIdLocal__________REDUX", adminIdLocal);
        const token = await getAppBridgeToken(app);
        console.log("token__________REDUX", token);
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/api-find-consultant/${adminIdLocal}`,
            {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    _t: Date.now(), // extra cache-buster
                },
            }
        );
        return response.data;
    }
);

/**
 * get consultant with shop id and consultant id
 */
export const fetchConsultantById = createAsyncThunk("consultants/fetchById", async ({ shop_id, consultant_id }) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/consultant-by-shop-id-and-consultant-id/${shop_id}/${consultant_id}`);
    return response.data;
});


/**
 * get chat history with shop id and consultant id
 */
export const fetchChatHistory = createAsyncThunk("consultants/fetchChatHistory", async ({ shopId, userId, consultantId }) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/chat/get/chat-history/${shopId}/${userId}/${consultantId}`);
    return response.data;
});

export const deleteConsultantById = createAsyncThunk("consultants/delete", async (id) => {
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/delete-consultant/${id}`);
    return response.data;
});

export const updateUserRequestById = createAsyncThunk("consultants/updateUserRequestById", async ({ shopId, userId, consultantId }) => {
    const response = await axios.put(`${process.env.REACT_APP_BACKEND_HOST}/api/chat/update-user-request/${shopId}/${userId}/${consultantId}`);
    return response.data;
});


const consultantSlice = createSlice({
    name: "consultants",
    initialState: {
        consultants: [],
        consultantOverview: null,
        chatHistory: null,
        loading: false,
        error: null,
        deletedConsultant: null,
        userInRequest: null,
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
            })
            .addCase(fetchConsultantById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConsultantById.fulfilled, (state, action) => {
                state.loading = false;
                state.consultantOverview = action.payload;
            })
            .addCase(fetchConsultantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchChatHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.chatHistory = action.payload;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateUserRequestById.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserRequestById.fulfilled, (state, action) => {
                state.loading = false;
                state.userInRequest = action.payload;
            })
            .addCase(updateUserRequestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default consultantSlice.reducer;
