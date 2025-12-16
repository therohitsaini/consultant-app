import { io } from "socket.io-client";


const SOCKET_URL = process.env.REACT_APP_BACKEND_HOST || "http://localhost:5001";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    
});
