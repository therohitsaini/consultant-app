import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import GlobalToast from "./GlobalToast";
import PopupNotification from "./MessageNotificationAlert";

export default function GlobalMessageNotification() {
    const location = useLocation();
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const lastProcessedMessageId = useRef(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("client_u_Identity");
        setUserId(id);
    }, []);
    const { messages: socketMessages } = useSelector(
        (state) => state.socket
    );
    useEffect(() => {
        if (!socketMessages?.length || userId !== socketMessages[socketMessages.length - 1].receiverId) return;

        const lastMessage = socketMessages.at(-1);

        // 🔒 prevent duplicate notification
        if (lastMessage?._id === lastProcessedMessageId.current) return;

        lastProcessedMessageId.current = lastMessage?._id;

        setNotificationMessage(lastMessage);
        setShowNotification(true);

        // auto close
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 6000);

        return () => clearTimeout(timer);
    }, [socketMessages]);

    return (
        <>
            {showNotification && notificationMessage && (
                <PopupNotification
                    message={notificationMessage}
                    onClose={() => setShowNotification(false)}
                    showNotification={showNotification}
                />
            )}
        </>
    );
}



