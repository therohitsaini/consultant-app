import React, { useEffect } from "react";

// GlobalToast component - sends toast notification to parent window (Shopify iframe)
// No UI rendering, only sends postMessage to parent window
export default function GlobalToast({ message, show, onClose, duration = 5000 }) {
    
    // Send message to parent window (Shopify) for toast notification
    useEffect(() => {
        if (show && message) {
            const messageData = Array.isArray(message) ? message[0] : message;
            console.log("messageData____________________", messageData);
            
            if (messageData && window.parent) {
                window.parent.postMessage(
                    {
                        type: "SHOW_TOAST",
                        message: messageData.text,
                        senderName: messageData.senderName,
                        avatar: messageData.avatar
                    },
                    "*"
                );
            }

            // Auto close after duration
            if (onClose) {
                const timer = setTimeout(() => {
                    onClose();
                }, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [show, message, duration, onClose]);

    // No UI rendering - toast comes from backend/parent window
    return null;
}
