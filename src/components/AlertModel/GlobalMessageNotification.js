import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import GlobalToast from "./GlobalToast";

export default function GlobalMessageNotification() {
    const location = useLocation();
    const [userId, setUserId] = useState(null);
    const [shopId, setShopId] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [showNotification, setShowNotification] = useState(true);
    const lastProcessedMessageId = useRef(null);

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
            
            if (latestMessage._id && latestMessage._id === lastProcessedMessageId.current) {
                return;
            }

            const isIncomingMessage = latestMessage.receiverId && 
                                     String(latestMessage.receiverId) === String(userId) &&
                                     String(latestMessage.senderId) !== String(userId);

            if (isIncomingMessage) {
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


