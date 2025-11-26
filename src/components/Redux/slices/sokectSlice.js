import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        activeUsers: [],
        messages: [],
        isConnected: false,
    },
    reducers: {
        setActiveUsers: (state, action) => {
            state.activeUsers = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        }
    }
});

export const { setActiveUsers, addMessage, setConnected } = socketSlice.actions;
export default socketSlice.reducer;
