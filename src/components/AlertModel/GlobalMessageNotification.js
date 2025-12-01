import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PopupNotification from "./MessageNotificationAlert";

// Global notification component - shows popup on ANY page when a new message arrives
export default function GlobalMessageNotification() {
    const messages = useSelector((state) => state.socket.messages);

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const lastNotificationMessageId = useRef(null);
    const [consultantId, setConsultantId] = useState(null);

    // Load consultantId once (from localStorage or fallback)
    useEffect(() => {
        const storedId = localStorage.getItem("consultant_u_Identity");
        if (storedId) {
            setConsultantId(storedId);
        } else {
            // Fallback to hardcoded consultantId already used in ChatsPage
            setConsultantId("691dbba35e388352e3203b0b");
        }
    }, []);

    // Watch Redux messages and show notification on new incoming message
    useEffect(() => {
        if (!consultantId || !messages || messages.length === 0) return;

        const latestMessage = messages[messages.length - 1];
        if (!latestMessage) return;

        // Skip if we've already shown notification for this message
        if (latestMessage._id && latestMessage._id === lastNotificationMessageId.current) {
            return;
        }

        // Only show for incoming messages (where consultant is receiver)
        const isIncoming =
            String(latestMessage.receiverId) === String(consultantId) ||
            // some backends may send 'to' instead of receiverId
            String(latestMessage.to) === String(consultantId);

        if (!isIncoming) return;

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


