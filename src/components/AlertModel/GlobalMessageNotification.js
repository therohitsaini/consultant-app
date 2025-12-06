import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import GlobalToast from "./GlobalToast";

// Global notification component - shows toast on ANY page when a new message arrives
// Works for both CLIENT and CONSULTANT
export default function GlobalMessageNotification() {
    const location = useLocation();
    const [userId, setUserId] = useState(null);
    const [shopId, setShopId] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [showNotification, setShowNotification] = useState(true);
    const lastProcessedMessageId = useRef(null);

    // Check if user is consultant (based on route)
    const isConsultant = location.pathname.includes('/consultant-dashboard') || 
                         location.pathname.includes('/consultant-chats-section') ||
                         location.pathname.includes('/users-page') ||
                         location.pathname.includes('/consulant-chats');

    useEffect(() => {
        const userId = localStorage.getItem('client_u_Identity');
        const shopId = localStorage.getItem('shop_o_Identity');
        setUserId(userId);
        setShopId(shopId);
    }, []);

    const { messages: socketMessages } = useSelector((state) => state.socket);

    useEffect(() => {
        if (socketMessages && socketMessages.length > 0 && userId) {
            const latestMessage = socketMessages[socketMessages.length - 1];
            
            // Skip if we've already shown notification for this message
            if (latestMessage._id && latestMessage._id === lastProcessedMessageId.current) {
                return;
            }

            // For both client and consultant: show notification if message is incoming
            // Incoming message = receiverId matches current userId (message is for current user)
            const isIncomingMessage = latestMessage.receiverId && 
                                     String(latestMessage.receiverId) === String(userId) &&
                                     String(latestMessage.senderId) !== String(userId);

            if (isIncomingMessage) {
                // Build notification payload
                // For consultant: get sender info from message or use default
                // For client: get sender info from message or use default
                const payload = {
                    senderName: latestMessage.senderName || 
                               (isConsultant ? "Client" : "Consultant"),
                    text: latestMessage.text || "New message received",
                    avatar: latestMessage.avatar || 
                           latestMessage.senderAvatar ||
                           "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
                };

                setNotificationMessage(payload);
                setShowNotification(true);
                
                // Mark this message as processed
                if (latestMessage._id) {
                    lastProcessedMessageId.current = latestMessage._id;
                }
            }
        }
    }, [socketMessages, userId, shopId, isConsultant]);

    return (
        <GlobalToast
            message={notificationMessage}
            show={showNotification}
            onClose={() => setShowNotification(false)}
            duration={5000}
        />
    );
}


