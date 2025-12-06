import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlobalToast({ message, show, onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show && message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onClose) onClose();
                }, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, message, duration, onClose]);

    // Send message to parent window (Shopify) for toast notification
    useEffect(() => {
        if (show && message) {
            const messageData = Array.isArray(message) ? message[0] : message;
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
        }
    }, [show, message]);

    if (!show || !message) return null;

    const messageData = Array.isArray(message) ? message[0] : message;








    const toastContent = (
        <>
            <style>{`
                .global-toast {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    min-width: 320px;
                    max-width: 400px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 999999 !important;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideInRight 0.3s ease forwards;
                    border-left: 4px solid #25d366;
                    transform: translateZ(0);
                    will-change: transform;
                }

                .global-toast.fade-out {
                    animation: slideOutRight 0.3s ease forwards;
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }

                .global-toast-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    flex-shrink: 0;
                }

                .global-toast-content {
                    flex: 1;
                    min-width: 0;
                }

                .global-toast-sender {
                    font-size: 14px;
                    font-weight: 600;
                    color: #212529;
                    margin-bottom: 4px;
                }

                .global-toast-text {
                    font-size: 13px;
                    color: #6c757d;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .global-toast-close {
                    background: none;
                    border: none;
                    color: #6c757d;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                    flex-shrink: 0;
                    transition: color 0.2s;
                }

                .global-toast-close:hover {
                    color: #212529;
                }
            `}</style>
            <div className={`global-toast ${!isVisible ? 'fade-out' : ''}`}>
                <img
                    src={messageData?.avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"}
                    alt={messageData?.senderName || "User"}
                    className="global-toast-avatar"
                />
                <div className="global-toast-content">
                    <div className="global-toast-sender">
                        {messageData?.senderName || "New Message"}
                    </div>
                    <p className="global-toast-text">
                        {messageData?.text || "New message received"}
                    </p>
                </div>
                <button
                    className="global-toast-close"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => {
                            if (onClose) onClose();
                        }, 300);
                    }}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </>
    );

    // Render toast using portal to ensure it's always at root level
    return createPortal(toastContent, document.body);
}

