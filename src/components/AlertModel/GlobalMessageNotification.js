import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PopupNotification from "./MessageNotificationAlert";

// Global notification component - shows popup on ANY page when a new message arrives
export default function GlobalMessageNotification() {
    const messages = useSelector((state) => state.socket.messages);

    // Current logged-in consultant (as you specified)
    const consultantId = "691dbba35e388352e3203b0b";
console.log("messages___________________>>>", messages);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const lastNotificationMessageId = useRef(null);

    // Watch Redux messages and show notification on new incoming message
    useEffect(() => {
        if (!consultantId || !messages || messages.length === 0) return;

        const latestMessage = messages[messages.length - 1];
        if (!latestMessage) return;

        // Example you gave:
        // { senderId: '691dbba35e388352e3203b0b', receiverId: '69257f27387c4f06e7de34d3', ... }

        // Skip if we've already shown notification for this message
        if (latestMessage._id && latestMessage._id === lastNotificationMessageId.current) {
            return;
        }

        const currentId = String(consultantId);
        const senderId = String(latestMessage.senderId || latestMessage.from || "");
        const receiverId = String(latestMessage.receiverId || latestMessage.to || "");

        // 1) If current consultant is sender → DO NOT show notification
        if (senderId === currentId) {
            return;
        }

        // 2) Only show when current consultant is receiver
        if (receiverId !== currentId) {
            return;
        }

        // Build simple notification payload
        const payload = {
            senderName: latestMessage.senderName || "New message",
            text: latestMessage.text || "",
            avatar: latestMessage.avatar || null,
        };

        setNotificationMessage(payload);
        setShowNotification(true);

        if (latestMessage._id) {
            lastNotificationMessageId.current = latestMessage._id;
        }
    }, [messages, consultantId]);

    if (!showNotification || !notificationMessage) {
        return null;
    }

    return (
        <PopupNotification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
        />
    );
}


