import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../Sokect-io/SokectConfig";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        isConnected: false,
        activeUsers: [],
        messages: [],
        insufficientBalance: null,
        isChatAccepted: null,
        chatTimer: {
            transactionId: null,
            startTime: null,
            isRunning: false,
        },
        autoChatEnded: null,
        incomingCall: null,
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
        setChatAccepted: (state, action) => {
            console.log("setChatAccepted", action.payload);
            state.isChatAccepted = action.payload;
            console.log("state.isChatAccepted", state.isChatAccepted);
        },
        setChatTimerStarted: (state, action) => {
            console.log("setChatTimerStarted", action.payload);
            state.chatTimer.transactionId = action.payload.transactionId;
            state.chatTimer.startTime = action.payload.startTime;
            state.chatTimer.isRunning = true;
            state.chatTimer.userId = action.payload.userId;
            state.chatTimer.shopId = action.payload.shopId;
            state.chatTimer.consultantId = action.payload.consultantId;
        },
        setChatTimerStopped: (state) => {
            state.chatTimer.transactionId = null;
            state.chatTimer.startTime = null;
            state.chatTimer.isRunning = false;
            state.chatTimer.userId = null;
            state.chatTimer.shopId = null;
            state.chatTimer.consultantId = null;
        },
        setAutoChatEnded: (state, action) => {
            console.log("setAutoChatEnded", state.autoChatEnded);
            state.autoChatEnded = action.payload;
            console.log("state.autoChatEnded", state.autoChatEnded);
        },
        setIncomingCall: (state, action) => {
            console.log("setIncomingCall", action.payload);
            state.incomingCall = action.payload;
            console.log("state.incomingCall", state.incomingCall);
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
    setActiveUsers,
    addMessage,
    setInsufficientBalanceError,
    clearMessages,
    markMessagesSeen,
    setChatAccepted,
    setChatTimerStarted,
    setChatTimerStopped,
    setAutoChatEnded,
    setIncomingCall,
} =
    socketSlice.actions;

export default socketSlice.reducer;
