// components/IncomingCallAlert.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  setIncomingCall } from "../Redux/slices/sokectSlice";
import {  socket } from "../Sokect-io/SokectConfig";
import { checkMicPermission } from "../ConsultantCards/ConsultantCards";
import TestRingtone from "../../pages/TestRingtone";
import axios from "axios";

export default function IncomingCallAlert() {
  const dispatch = useDispatch();
  const userId =
    localStorage.getItem("client_u_Identity__") ||
    localStorage.getItem("consultant_u_Identity");
  const { incomingCall, callEnded } = useSelector((state) => state.socket);
  const { callAccepted } = useSelector((state) => state.socket);

  useEffect(() => {
    if (callEnded?.callId && incomingCall) {
      handleReject();
    }
  }, [callEnded]);

  if (!incomingCall) return null;

  const { callerId, callType, channelName, callerName, shop } = incomingCall;

  const handleAccept = async () => {
    localStorage.setItem("callAccepted", JSON.stringify(callAccepted));
    const shopId = localStorage.getItem("shop_o_Identity");
    const hasMicPermission = await checkMicPermission();
    if (!hasMicPermission) {
      alert("Please grant microphone permission to start the call");
      return;
    }
    const uid = Math.floor(Math.random() * 1000000);
    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/generate-token`;
    const res = await axios.post(
      url,
      {
        channelName,
        uid,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = res.data;
    if (data.token) {
      socket.emit("call-accepted", {
        callerId,
        receiverId: userId,
        channelName,
        callType: incomingCall.callType,
        shopId: shopId,
      });
      dispatch(setIncomingCall(null));
      const tokenEncoded = encodeURIComponent(data.token);
      const appIdParam = data.appId ? `&appId=${data.appId}` : "";
      const callType = incomingCall.callType || "voice";

      const returnUrl = `https://${shop}/apps/consultant-theme/consultant-dashboard`;
      const callUrl =
        `${"https://test-consultation-app.zend-apps.com"}/video/calling/page` +
        `?callerId=${callerId}` +
        `&receiverId=${userId}` +
        `&callType=${callType}` +
        `&uid=${uid}` +
        `&channelName=${channelName}` +
        `&token=${tokenEncoded}` +
        appIdParam +
        `&userId=${userId}` +
        `&userType=${"consultant"}` +
        `&shopId=${shopId}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}`;
      setTimeout(() => {
        // window.top.location.href = callUrl;
        window.open(callUrl, "_blank");
      }, 1000);
    }
  };

  const handleReject = () => {
    socket.emit("reject-call", {
      callerId,
      receiverId: userId,
      channelName,
      callType: incomingCall.callType,
    });
    dispatch(setIncomingCall(null));
  };
  if (!incomingCall) return null;

  return (
    <>
      <TestRingtone incomingCall={incomingCall} />
      <div
        style={{
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
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <img
            src="https://imgs.search.brave.com/8vitWtK7-18taVi4PjQG1jZwM0baiJg4CfpjJVibqtw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZnBt/YWtlci5jb20vaW1h/Z2VzL2xhbmRpbmcv/aGVhZHNob3RzL2Js/b2dfMC5qcGc"
            alt="Caller Avatar"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "12px",
              objectFit: "cover",
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              {callType} call
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              {callerName} is calling you
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
              transition: "background 0.2s ease",
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
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
}
