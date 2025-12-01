import React, { useEffect } from "react";

export default function PopupNotification({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 5000);
        return () => clearTimeout(timer);
    }, [onClose]);
    
    console.log("PopupNotification - message received:", message);
    
    // Handle both single object and array
    const messageData = Array.isArray(message) ? message[0] : message;

    return (
        <>
            {/* Internal CSS */}
            <style>{`
                .bs-popup {
                    position: fixed;
                    bottom: 20px;       /* bottom */
                    right: 20px;        /* right */
                    width: 330px;
                    background: rgba(20,20,20,0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 8px;
                    padding: 1rem;
                    z-index: 99999;
                    color: #fff;
                    box-shadow: 0px 8px 25px rgba(0,0,0,0.3);
                    animation: slideUp .4s ease forwards;
                }

                /* Slide from bottom-right */
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .bs-popup img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .bs-close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 22px;
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    cursor: pointer;
                }

                .bs-popup p {
                    margin: 0;
                    opacity: .9;
                }
            `}</style>

            <div className="bs-popup d-flex align-items-center gap-3 shadow-lg">
                <button className="bs-close-btn" onClick={onClose}>×</button>

                <img
                    src={messageData?.avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"}
                    alt={messageData?.senderName || "User"}
                />

                <div>
                    <h5 className="fw-bold mb-1">{messageData?.senderName || "User"}</h5>
                    <p>{messageData?.text || "New message received"}</p>
                </div>
            </div>
        </>
    );
}
