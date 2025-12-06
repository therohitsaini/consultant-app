// components/SocketProvider.jsx
import { useEffect } from "react";
import { socket } from "./SokectConfig";
import { useDispatch } from "react-redux";
import { setConnected, setActiveUsers, addMessage } from "../Redux/slices/sokectSlice";

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

        // Set up event listeners
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("activeUsers", handleActiveUsers);
        socket.on("receiveMessage", handleReceiveMessage);

        // Cleanup function
        return () => {
            console.log("Cleaning up socket listeners");
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("activeUsers", handleActiveUsers);
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [dispatch]);

    return children;
}
