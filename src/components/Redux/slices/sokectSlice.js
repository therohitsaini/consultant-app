import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../Sokect-io/SokectConfig";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        isConnected: false,
        activeUsers: [],
        messages: [],
        insufficientBalanceError: null,
    },
    reducers: {
        connectSocket: (state, action) => {
            if (!socket.connected) {
                socket.connect();
                socket.emit("register", action.payload); // user_id
            }
        },
        disconnectSocket: () => {
            socket.disconnect();
        },
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setActiveUsers: (state, action) => {
            state.activeUsers = action.payload;
        },
        addMessage: (state, action) => {
            console.log("action.payload", action.payload);
            state.messages.push(action.payload);
            console.log("state.messages", state.messages);
        },
        setInsufficientBalanceError: (state, action) => {
            console.log("action.payload", action.payload);
            console.log("state.insufficientBalanceError", state.insufficientBalanceError);
            state.insufficientBalanceError = action.payload;
            console.log("state.insufficientBalanceError", state.insufficientBalanceError);
        },
        clearMessages: (state) => {
            state.messages = [];
            state.insufficientBalanceError = null;
        }
    }
});

export const { connectSocket, disconnectSocket, setConnected, setActiveUsers, addMessage, setInsufficientBalanceError, clearMessages } =
    socketSlice.actions;

export default socketSlice.reducer;
