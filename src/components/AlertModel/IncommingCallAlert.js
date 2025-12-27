// components/IncomingCallAlert.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIncomingCall } from "../Redux/slices/sokectSlice";
import { socket } from "../Sokect-io/SokectConfig";

export default function IncomingCallAlert() {
    const dispatch = useDispatch();
    const userId = localStorage.getItem('client_u_Identity') || localStorage.getItem('consultant_u_Identity');
    const { incomingCall } = useSelector((state) => state.socket);
    console.log("incomingCall", incomingCall);
    if (!incomingCall) return console.log("No incoming call");

    const { callerId, callType, channelName } = incomingCall;

    const handleAccept = async () => {
        const uid = Math.floor(Math.random() * 1000000);
        const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/generate-token`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ channelName, uid }),
        });
        const data = await res.json();
        console.log("data____Reciver_____", data)
        if (data.token) {
            socket.emit("call-accepted", { callerId, receiverId: userId, channelName, callType: incomingCall.callType });
            console.log("Call accepted", incomingCall);
            dispatch(setIncomingCall(null));
            window.top.location.href = `https://${"rohit-12345839.myshopify.com"}/apps/consultant-theme/video-calling-page?callerId=${"69328ff18736b56002ef83df"}&receiverId=${userId}&callType=${callType}&token=${data.token}&channelName=${channelName}`;

        }
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
            width: "320px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            zIndex: 1000,
            padding: "10px",
            fontFamily: "Arial, sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <img
                    src="https://via.placeholder.com/60"
                    alt="Caller Avatar"
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        marginRight: "12px",
                        objectFit: "cover"
                    }}
                />
                <div>
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#222" }}>
                        Incoming {callType} Call
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                        From: {callerId}
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                    onClick={handleAccept}
                    style={{
                        flex: 1,
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "5px",
                        fontSize: "14px",
                        cursor: "pointer",
                        marginRight: "8px",
                        transition: "background 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                >
                    Accept
                </button>

                <button
                    onClick={handleReject}
                    style={{
                        flex: 1,
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "5px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "background 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
