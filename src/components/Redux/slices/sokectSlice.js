import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../Sokect-io/SokectConfig";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        isConnected: false,
        activeUsers: [],
        messages: [],
        insufficientBalance: null,
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
            state.messages.push(action.payload);
        },
        markMessagesSeen: (state, action) => {
            const { senderId } = action.payload;
            state.messages = state.messages.map(msg =>
                msg.senderId === senderId
                    ? { ...msg, seen: true }
                    : msg
            );
        },


        setInsufficientBalanceError: (state, action) => {
            state.insufficientBalance = action.payload;
            console.log("state__insufficientBalance", state.insufficientBalance);
            console.log("action.payload", action.payload);

        },

        clearMessages: (state) => {
            state.messages = [];
            // state.insufficientBalance = null; 
        }
    }
});

export const { connectSocket,
    disconnectSocket,
    setConnected,
    setActiveUsers, addMessage, setInsufficientBalanceError, clearMessages, markMessagesSeen } =
    socketSlice.actions;

export default socketSlice.reducer;
