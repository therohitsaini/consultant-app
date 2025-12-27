// components/IncomingCallAlert.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIncomingCall } from "../Redux/slices/sokectSlice";

export default function IncomingCallAlert() {
    const dispatch = useDispatch();
    const { incomingCall } = useSelector((state) => state.socket);
    console.log("incomingCall", incomingCall);
    if (!incomingCall) return console.log("No incoming call");

    const { callerId, callType, channelName } = incomingCall;

    const handleAccept = () => {
        console.log("Call accepted", incomingCall);
        // You can emit event to backend here if needed
        // socket.emit("accept-call", { channelName, callerId });

        // Close the alert
        dispatch(setIncomingCall(null));
    };
    const handleReject = () => {
        console.log("Call rejected", incomingCall);
        // Emit reject event if needed
        // socket.emit("reject-call", { channelName, callerId });

        dispatch(setIncomingCall(null));
    };

    return (
        <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            zIndex: 1000
        }}>
            <p><strong>Incoming {callType} call</strong></p>
            <p>From: {callerId}</p>
            <button onClick={handleAccept} style={{ marginRight: "10px" }}>Accept</button>
            <button onClick={handleReject}>Reject</button>
        </div>
    );
}
