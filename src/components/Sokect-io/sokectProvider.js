// components/SocketProvider.jsx
import { useEffect } from "react";
import { socket } from "./SokectConfig";
import { useDispatch } from "react-redux";
import { setConnected, setActiveUsers, addMessage } from "../Redux/slices/sokectSlice";

export default function SocketProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("connection", () => {
            console.log("Connected to socket");
            dispatch(setConnected(true));
            socket.emit("register", "690c374f605cb8b946503ccb");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket");
            dispatch(setConnected(false));
        });

        socket.on("activeUsers", (list) => {
            console.log("Active users", list);
            dispatch(setActiveUsers(list));
        });

        socket.on("receiveMessage", (msg) => {
            console.log("Received message", msg);
            dispatch(addMessage(msg));
        });

        return () => {
            console.log("Cleaning up socket");
            socket.off("connection");
            socket.off("disconnect");
            socket.off("activeUsers");
            socket.off("receiveMessage");
        };
    }, []);

    return children;
}
