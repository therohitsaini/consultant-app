import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import styles from './UserChat.module.css';
import styles from "./UserChat.module.css"
import { socket } from '../Sokect-io/SokectConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, fetchConsultantById } from '../Redux/slices/ConsultantSlices';
import PopupNotification from '../AlertModel/MessageNotificationAlert';

const UserChat = () => {
    const [text, setText] = useState()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { consultantId } = useParams()
    const [clientId, setClientId] = useState(null);
    const [shopId, setShopId] = useState(null);

    useEffect(() => {
        const storedClientId = localStorage.getItem('client_u_Identity');
        const storedShopId = localStorage.getItem('shop_o_Identity');
        setClientId(storedClientId);
        setShopId(storedShopId);
        console.log("UserChat - ClientId:", storedClientId, "ShopId:", storedShopId, "ConsultantId:", consultantId);
    }, [consultantId]);

    const { consultantOverview } = useSelector((state) => state.consultants);
    const { chatHistory } = useSelector((state) => state.consultants);
    const { messages: socketMessages } = useSelector((state) => state.socket);
    const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${consultantOverview?.consultant?.profileImage?.replace("\\", "/")}`;
    
    const [chatMessagesData, setChatMessagesData] = useState([]);
    const lastProcessedMessageId = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const lastNotificationMessageId = useRef(null);
    useEffect(() => {
        dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: consultantId }))
    }, [dispatch, consultantId]);

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    };

    // Update messages from chatHistory
    useEffect(() => {
        if (chatHistory?.chatHistory) {
            setChatMessagesData(chatHistory.chatHistory);
            // Reset last processed message when chat changes
            lastProcessedMessageId.current = null;
        }
    }, [chatHistory]);

    // Auto-scroll when messages update
    useEffect(() => {
        scrollToBottom();
    }, [chatMessagesData]);

    // Listen to socket messages and update chat in real-time
    useEffect(() => {
        if (!clientId || !consultantId || !shopId) {
            console.log("UserChat - Missing IDs:", { clientId, consultantId, shopId });
            return;
        }
        
        if (!socketMessages || socketMessages.length === 0) {
            return;
        }

        console.log("UserChat - Socket messages received:", socketMessages.length, "Current IDs:", { clientId, consultantId, shopId });
        
        // Process all new messages, not just the latest one
        socketMessages.forEach((message) => {
            // Skip if message doesn't have required fields
            if (!message || !message._id) {
                console.log("UserChat - Skipping invalid message:", message);
                return;
            }

            // Skip if we've already processed this message
            if (message._id === lastProcessedMessageId.current) {
                return;
            }

            // Normalize IDs for comparison (handle string/number mismatch)
            const messageShopId = String(message.shop_id || message.shopId || '');
            const currentShopId = String(shopId || '');
            const messageSenderId = String(message.senderId || '');
            const messageReceiverId = String(message.receiverId || '');
            const currentClientId = String(clientId || '');
            const currentConsultantId = String(consultantId || '');

            console.log("UserChat - Checking message:", {
                messageShopId,
                currentShopId,
                messageSenderId,
                messageReceiverId,
                currentClientId,
                currentConsultantId
            });

            // Check if message belongs to current chat
            const isCurrentChatMessage =
                messageShopId === currentShopId &&
                ((messageSenderId === currentClientId && messageReceiverId === currentConsultantId) ||
                    (messageSenderId === currentConsultantId && messageReceiverId === currentClientId));

            if (isCurrentChatMessage) {
                console.log("UserChat - ✅ Processing new message for current chat:", message);
                
                // Mark this message as processed
                lastProcessedMessageId.current = message._id;

                // Add new message to chat (check for duplicates and replace temp messages)
                setChatMessagesData(prev => {
                    const messageExists = prev.some(msg => msg._id === message._id);
                    if (messageExists) {
                        console.log("UserChat - Message already exists, skipping");
                        return prev;
                    }

                    // Check if there's a temporary message with same text and sender (optimistic update)
                    const tempMessageIndex = prev.findIndex(msg =>
                        msg._id?.startsWith('temp-') &&
                        msg.text === message.text &&
                        String(msg.senderId) === messageSenderId
                    );

                    if (tempMessageIndex !== -1) {
                        console.log("UserChat - Replacing temp message with real message");
                        // Replace temp message with real message
                        const newMessages = [...prev];
                        newMessages[tempMessageIndex] = message;
                        return newMessages;
                    }

                    console.log("UserChat - Adding new message to chat");
                    // Add new message
                    return [...prev, message];
                });
            } else {
                console.log("UserChat - ❌ Message doesn't belong to current chat");
            }
        });
    }, [socketMessages, clientId, consultantId, shopId]);

    // Show popup notification when new incoming message arrives
    useEffect(() => {
        if (!clientId || !consultantId || !shopId) return;
        if (!socketMessages || socketMessages.length === 0) return;

        const latestMessage = socketMessages[socketMessages.length - 1];
        if (!latestMessage) return;

        // Skip if we've already shown notification for this message
        if (latestMessage._id && latestMessage._id === lastNotificationMessageId.current) {
            return;
        }

        // Incoming for user: consultant → client
        const isIncoming =
            String(latestMessage.senderId) === String(consultantId) &&
            String(latestMessage.receiverId) === String(clientId) &&
            String(latestMessage.shop_id) === String(shopId);

        if (!isIncoming) return;

        // Build notification payload using consultant data
        const payload = {
            senderName: consultantOverview?.consultant?.fullname || 'Consultant',
            text: latestMessage.text || '',
            avatar: consultantOverview?.consultant?.profileImage
                ? `${process.env.REACT_APP_BACKEND_HOST}/${consultantOverview.consultant.profileImage.replace("\\", "/")}`
                : null,
        };

        setNotificationMessage(payload);
        setShowNotification(true);

        if (latestMessage._id) {
            lastNotificationMessageId.current = latestMessage._id;
        }
    }, [socketMessages, clientId, consultantId, shopId, consultantOverview]);

    const sendChat = () => {
        if (text.trim() === "" || !clientId || !consultantId || !shopId) return;

        // Check if socket is connected
        if (!socket.connected) {
            console.warn("Socket not connected, attempting to reconnect...");
            socket.connect();
            // Wait a bit for connection, then send
            setTimeout(() => {
                if (socket.connected) {
                    sendMessage();
                } else {
                    console.error("Failed to connect socket");
                    alert("Connection lost. Please refresh the page.");
                }
            }, 1000);
            return;
        }

        sendMessage();

        function sendMessage() {
            const messageData = {
                senderId: clientId,
                receiverId: consultantId,
                shop_id: shopId,
                text: text,
                timestamp: new Date().toISOString()
            };

            // Optimistically add message to UI immediately
            const optimisticMessage = {
                _id: `temp-${Date.now()}`,
                ...messageData
            };
            setChatMessagesData(prev => [...prev, optimisticMessage]);

            // Send message via socket
            socket.emit("sendMessage", messageData);
            console.log("Message sent via socket:", messageData);
            setText("");
        }
    }

    useEffect(() => {
        if (shopId && clientId && consultantId) {
            dispatch(fetchChatHistory({ shopId: shopId, userId: clientId, consultantId: consultantId }));
        }
    }, [dispatch, shopId, clientId, consultantId]);

    // Direct socket listener as backup (in addition to Redux)
    useEffect(() => {
        if (!clientId || !consultantId || !shopId) return;

        const handleDirectMessage = (message) => {
            console.log("UserChat - Direct socket message received:", message);
            
            // Normalize IDs for comparison
            const messageShopId = String(message.shop_id || message.shopId || '');
            const currentShopId = String(shopId || '');
            const messageSenderId = String(message.senderId || '');
            const messageReceiverId = String(message.receiverId || '');
            const currentClientId = String(clientId || '');
            const currentConsultantId = String(consultantId || '');

            // Check if message belongs to current chat
            const isCurrentChatMessage =
                messageShopId === currentShopId &&
                ((messageSenderId === currentClientId && messageReceiverId === currentConsultantId) ||
                    (messageSenderId === currentConsultantId && messageReceiverId === currentClientId));

            if (isCurrentChatMessage && message._id) {
                console.log("UserChat - ✅ Direct: Processing message for current chat");
                
                // Skip if already processed
                if (message._id === lastProcessedMessageId.current) return;
                lastProcessedMessageId.current = message._id;

                setChatMessagesData(prev => {
                    const messageExists = prev.some(msg => msg._id === message._id);
                    if (messageExists) return prev;

                    // Check for temp message
                    const tempMessageIndex = prev.findIndex(msg =>
                        msg._id?.startsWith('temp-') &&
                        msg.text === message.text &&
                        String(msg.senderId) === messageSenderId
                    );

                    if (tempMessageIndex !== -1) {
                        const newMessages = [...prev];
                        newMessages[tempMessageIndex] = message;
                        return newMessages;
                    }

                    return [...prev, message];
                });
            }
        };

        // Listen for receiveMessage event directly
        socket.on("receiveMessage", handleDirectMessage);
        console.log("consultantOverview_________>_____>", handleDirectMessage);

        return () => {
            socket.off("receiveMessage", handleDirectMessage);
        };
    }, [clientId, consultantId, shopId]);


    return (
        <Fragment>
            {/* Global-style message notification for user side */}
            {showNotification && notificationMessage && (
                <PopupNotification
                    message={notificationMessage}
                    onClose={() => setShowNotification(false)}
                />
            )}
            {/* <button className="btn btn-link back-button mb-3" onClick={() => navigate('/consultant-cards')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Consultants
            </button> */}
            <div className={styles.chatPageContainer}>

                <div className={styles.container}>
                    {/* Chat Window */}
                    <div className={styles.chatWindow}>
                        <div className={styles.chatWindowContent}>
                            {/* Chat Header */}
                            <div className={styles.chatHeader}>
                                <div className={styles.chatHeaderInfo}>
                                    <button
                                        className={styles.backButton}
                                        onClick={() => navigate(-1)}
                                        title="Go Back"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className={styles.avatarWrapper}>
                                        <div className={styles.chatHeaderAvatar}>
                                            <img src={imageUrl} alt={consultantOverview?.consultant?.fullname} className={styles.chatHeaderAvatar} />
                                        </div>
                                        {consultantOverview?.consultant?.isActive && (
                                            <div className={styles.onlineIndicator}></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className={styles.chatHeaderName}>
                                            {consultantOverview?.consultant?.fullname
                                            }
                                        </div>
                                        <div className={styles.chatHeaderStatus} style={{ color: consultantOverview?.consultant?.isActive ? '#10b981' : '#6c757d' }}>
                                            {consultantOverview?.consultant?.isActive ? 'Active now' : 'Offline'}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.chatHeaderActions}>
                                    <button
                                        className={styles.headerButton}
                                        title="Video Call"
                                        onClick={() => navigate('/video-call', { state: { conversation: consultantOverview?.consultant } })}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M23 7l-7 5 7 5V7z" />
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                        </svg>
                                    </button>
                                    <button className={styles.headerButton} title="More Options">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className={styles.messagesArea} ref={messagesAreaRef}>
                                {chatMessagesData.length === 0 ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    <>
                                        {chatMessagesData.map((message) => {
                                            // User's messages should be on right, consultant's on left
                                            const isOwn = message.senderId === clientId;

                                            // Format timestamp
                                            const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            });

                                            return (
                                                <div
                                                    key={message._id}
                                                    className={`${styles.messageContainer} ${isOwn ? styles.messageContainerRight : styles.messageContainerLeft}`}
                                                >
                                                    <div className={`${styles.messageBubble} ${isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther}`}>
                                                        {!isOwn && (
                                                            <div className={styles.messageSender}>
                                                                {consultantOverview?.consultant?.fullname || 'Consultant'}
                                                            </div>
                                                        )}
                                                        <div className={styles.messageText}>
                                                            {message.text}
                                                        </div>
                                                        <div className={styles.messageTimestamp}>
                                                            {timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className={styles.messageInputArea}>
                                <div className={styles.inputGroup}>
                                    <button className={styles.attachButton} title="Attach File">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                    </button>
                                    <input
                                        onChange={(e) => setText(e.target.value)}
                                        value={text || ''}
                                        type="text"
                                        className={styles.messageInput}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && text?.trim()) {
                                                sendChat();
                                            }
                                        }}
                                    />
                                    <button onClick={sendChat} className={styles.sendButton} title="Send">
                                        <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UserChat;

