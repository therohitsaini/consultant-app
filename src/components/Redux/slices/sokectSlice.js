import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../Sokect-io/SokectConfig";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        isConnected: false,
        activeUsers: [],
        messages: [],
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
        clearMessages: (state) => {
            state.messages = [];
        }
    }
});

export const { connectSocket, disconnectSocket, setConnected, setActiveUsers, addMessage, clearMessages } =
    socketSlice.actions;

export default socketSlice.reducer;
