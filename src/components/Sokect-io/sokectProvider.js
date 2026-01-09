// // components/SocketProvider.jsx
// import { useEffect } from "react";
// import { socket } from "./SokectConfig";
// import { useDispatch } from "react-redux";
// import { setConnected, setActiveUsers, addMessage, setInsufficientBalanceError, markMessagesSeen, setChatAccepted, setChatTimerStarted, setChatTimerStopped, setAutoChatEnded, setIncomingCall, setCallAccepted, setCallEnded, setCallRejected } from "../Redux/slices/sokectSlice";

// export default function SocketProvider({ children }) {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (socket.connected) {
//             console.log("Socket already connected");
//             dispatch(setConnected(true));
//         }

//         const handleConnect = () => {
//             console.log("Connected to socket");
//             dispatch(setConnected(true));
//             const clientId = localStorage.getItem('client_u_Identity') || "69328ff18736b56002ef83df";
//             socket.emit("register", clientId);
//             console.log("Client ID", clientId);
//         };

//         const handleDisconnect = () => {
//             console.log("Disconnected from socket");
//             dispatch(setConnected(false));
//         };

//         const handleActiveUsers = (list) => {
//             console.log("Active users", list);
//             dispatch(setActiveUsers(list));
//         };

//         const handleReceiveMessage = (msg) => {
//             console.log("Received message____Sokect", msg)
//             dispatch(addMessage(msg));
//         };
//         const handleSeenUpdate = ({ seenBy }) => {
//             console.log("Seen update by:", seenBy);
//             dispatch(markMessagesSeen({ seenBy }));
//         };


//         const handleBalanceError = (error) => {
//             console.log("Balance Error From Server:", error);
//             dispatch(setInsufficientBalanceError(error));
//         };

//         const handleUserChatAccepted = (response) => {
//             console.log("User chat accepted", response.message);
//             dispatch(setChatAccepted(response.message));
//         };

//         const handleChatTimerStarted = (response) => {
//             console.log("Chat timer started", response);
//             dispatch(setChatTimerStarted(response));
//         };
//         const handleChatEnded = (data) => {
//             console.log("Chat ended from backend", data);
//             dispatch(setChatTimerStopped());
//         };
//         const autoChatEnded = (data) => {
//             console.log("Auto chat ended", data);
//             dispatch(setAutoChatEnded(data));
//         };
//         const imcomminCall = (call) => {
//             console.log("Incoming call", call);
//             dispatch(setIncomingCall(call));
//         }
//         const callAccepted = (data) => {
//             console.log("Call accepted", data);
//             dispatch(setCallAccepted(data));
//         }
//         const callEnded = (data) => {
//             console.log("Call ended", data);
//             dispatch(setCallEnded(data));
//         }
//         const callRejected = (data) => {
//             console.log("Call rejected", data);
//             dispatch(setCallRejected(data));
//         }

//         socket.on("connect", handleConnect);
//         socket.on("disconnect", handleDisconnect);
//         socket.on("activeUsers", handleActiveUsers);
//         socket.on("receiveMessage", handleReceiveMessage);
//         socket.on("seenUpdate", handleSeenUpdate);
//         socket.on("balanceError", handleBalanceError);
//         socket.on("userChatAccepted", handleUserChatAccepted);
//         socket.on("chatTimerStarted", handleChatTimerStarted);
//         socket.on("chatEnded", handleChatEnded);
//         socket.on("autoChatEnded", autoChatEnded);
//         socket.on("incoming-call", imcomminCall);
//         socket.on("call-accepted-started", callAccepted);
//         socket.on("call-missed", callEnded);
//         socket.on("call-ended-rejected", callRejected);

//         return () => {
//             console.log("Cleaning up socket listeners");
//             socket.off("connect", handleConnect);
//             socket.off("disconnect", handleDisconnect);
//             socket.off("activeUsers", handleActiveUsers);
//             socket.off("receiveMessage", handleReceiveMessage);
//             socket.off("seenUpdate", handleSeenUpdate);
//             socket.off("balanceError", handleBalanceError);
//             socket.off("userChatAccepted", handleUserChatAccepted);
//             socket.off("chatTimerStarted", handleChatTimerStarted);
//             socket.off("chatEnded", handleChatEnded);
//             socket.off("autoChatEnded", autoChatEnded);
//             socket.off("incoming-call", imcomminCall);
//             socket.off("call-accepted-started", callAccepted);
//             socket.off("call-missed", callEnded);
//             socket.off("call-ended-rejected", callRejected);
//         };
//     }, [dispatch]);


//     return children;
// }

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
} from "../Redux/slices/sokectSlice";

export default function SocketProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = getSocket();
        const clientId = localStorage.getItem("client_u_Identity") || "69328ff18736b56002ef83df"

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
            dispatch(setCallAccepted(data))
        );

        socket.on("call-missed", (data) =>
            dispatch(setCallEnded(data))
        );

        socket.on("call-ended-rejected", (data) =>
            dispatch(setCallRejected(data))
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
        };

    }, [dispatch]);

    return children;
}


