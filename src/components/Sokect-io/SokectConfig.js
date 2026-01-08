// import { io } from "socket.io-client";


// const SOCKET_URL = process.env.REACT_APP_BACKEND_HOST || "http://localhost:5001";

// export const socket = io(SOCKET_URL, {
//     transports: ["websocket"],
//     withCredentials: true,
//     reconnection: true,
//     reconnectionAttempts: 10,
//     reconnectionDelay: 1000,

// });
import { io } from "socket.io-client";

const SOCKET_URL =
    process.env.REACT_APP_BACKEND_HOST || "http://localhost:5001";

let socketInstance = null;

export const getSocket = () => {
    if (!socketInstance) {
        socketInstance = io(SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true,
            autoConnect: false, // 🔴 IMPORTANT for multi-tab
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });
    }
    return socketInstance;
};

// Export socket as the instance for backward compatibility
// This ensures existing code using socket.on(), socket.emit() etc. continues to work
export const socket = getSocket();