// components/SocketProvider.jsx
import { useEffect } from "react";
import { socket } from "./SokectConfig";
import { useDispatch } from "react-redux";
import { setConnected, setActiveUsers, addMessage, setInsufficientBalanceError, markMessagesSeen, setChatAccepted, setChatTimerStarted, setChatTimerStopped, setAutoChatEnded } from "../Redux/slices/sokectSlice";

export default function SocketProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if socket is already connected
        if (socket.connected) {
            console.log("Socket already connected");
            dispatch(setConnected(true));
        }

        // Listen for connect event (correct event name for socket.io)
        const handleConnect = () => {
            console.log("Connected to socket");
            dispatch(setConnected(true));
            // Register with shop ID if needed
            const clientId = localStorage.getItem('client_u_Identity') || "690c374f605cb8b946503ccb";
            socket.emit("register", clientId);
        };

        const handleDisconnect = () => {
            console.log("Disconnected from socket");
            dispatch(setConnected(false));
        };

        const handleActiveUsers = (list) => {
            console.log("Active users", list);
            dispatch(setActiveUsers(list));
        };

        const handleReceiveMessage = (msg) => {
            console.log("Received message____Sokect", msg)
            dispatch(addMessage(msg));
        };
        const handleSeenUpdate = ({ seenBy }) => {
            console.log("Seen update by:", seenBy);
            dispatch(markMessagesSeen({ seenBy }));
        };


        const handleBalanceError = (error) => {
            console.log("Balance Error From Server:", error);
            dispatch(setInsufficientBalanceError(error));
        };

        const handleUserChatAccepted = (response) => {
            console.log("User chat accepted", response.message);
            dispatch(setChatAccepted(response.message));
        };

        const handleChatTimerStarted = (response) => {
            console.log("Chat timer started", response);
            dispatch(setChatTimerStarted(response));
        };
        const handleChatEnded = (data) => {
            console.log("Chat ended from backend", data);
            dispatch(setChatTimerStopped());
        };
        const autoChatEnded = (data) => {
            console.log("Auto chat ended", data);
            dispatch(setAutoChatEnded(data));
        };


        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("activeUsers", handleActiveUsers);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("seenUpdate", handleSeenUpdate);
        socket.on("balanceError", handleBalanceError);
        socket.on("userChatAccepted", handleUserChatAccepted);
        socket.on("chatTimerStarted", handleChatTimerStarted);
        socket.on("chatEnded", handleChatEnded);
        socket.on("autoChatEnded", autoChatEnded);
        // Cleanup function
        return () => {
            console.log("Cleaning up socket listeners");
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("activeUsers", handleActiveUsers);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("seenUpdate", handleSeenUpdate);
            socket.off("balanceError", handleBalanceError);
            socket.off("userChatAccepted", handleUserChatAccepted);
            socket.off("chatTimerStarted", handleChatTimerStarted);
            socket.off("chatEnded", handleChatEnded);
            socket.off("autoChatEnded", autoChatEnded);
        };
    }, [dispatch]);

    return children;
}
