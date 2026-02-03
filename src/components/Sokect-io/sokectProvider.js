

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "./SokectConfig";

import {
    setConnected,
    setActiveUsers,
    addMessage,
    markMessagesSeen,
    setInsufficientBalanceError,
    setChatAccepted,
    setChatTimerStarted,
    setChatTimerStopped,
    setAutoChatEnded,
    setIncomingCall,
    setCallAccepted,
    setCallEnded,
    setCallRejected,
    setConfirmChat,
} from "../Redux/slices/sokectSlice";

export default function SocketProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = getSocket();
        const clientId = localStorage.getItem("client_u_Identity")
        console.log("Client ID Sokect Provider________________", clientId)
        const onConnect = () => {
            console.log("✅ ____Socket connected");
            socket.emit("register", clientId);
            dispatch(setConnected(true));
        };

        const onDisconnect = () => {
            console.log("❌ Socket disconnected");
            dispatch(setConnected(false));
        };
        if (!socket.connected) socket.connect();
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("activeUsers", (list) =>
            dispatch(setActiveUsers(list))
        );

        socket.on("receiveMessage", (msg) =>
            dispatch(addMessage(msg))
        );

        socket.on("seenUpdate", (data) =>
            dispatch(markMessagesSeen(data))
        );

        socket.on("balanceError", (err) =>
            dispatch(setInsufficientBalanceError(err))
        );

        socket.on("userChatAccepted", (res) =>
            dispatch(setChatAccepted(res.message))
        );

        socket.on("chatTimerStarted", (res) =>
            dispatch(setChatTimerStarted(res))
        );

        socket.on("chatEnded", () =>
            dispatch(setChatTimerStopped())
        );

        socket.on("autoChatEnded", (data) =>
            dispatch(setAutoChatEnded(data))
        );

        socket.on("incoming-call", (call) =>
            dispatch(setIncomingCall(call))
        );

        socket.on("call-accepted-started", (data) =>
            dispatch(setCallAccepted(data)),
        );

    socket.on("call-missed", (data) =>
        dispatch(setCallEnded(data))
    );

    socket.on("call-ended-rejected", (data) =>
        dispatch(setCallRejected(data))
    );
    socket.on("acceptUser", (data) =>
        dispatch(setConfirmChat(data)),
    );

    return () => {
        console.log("🧹 Cleaning socket listeners");

        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("activeUsers");
        socket.off("receiveMessage");
        socket.off("seenUpdate");
        socket.off("balanceError");
        socket.off("userChatAccepted");
        socket.off("chatTimerStarted");
        socket.off("chatEnded");
        socket.off("autoChatEnded");
        socket.off("incoming-call");
        socket.off("call-accepted-started");
        socket.off("call-missed");
        socket.off("call-ended-rejected");
        socket.off("acceptUser");
    };

}, [dispatch]);

return children;
}


