import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatsPage.module.css';
import axios from 'axios';
import { socket } from '../Sokect-io/SokectConfig';
import { fetchChatHistory, updateUserRequestById } from '../Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../Redux/slices/sokectSlice';
import PopupNotification from '../AlertModel/MessageNotificationAlert';
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatsPage = () => {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showChatView, setShowChatView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [chatMessagesData, setChatMessagesData] = useState([]);
    const [consultantId, setConsultantId] = useState(null);
    const [shopId, setShopId] = useState(null);
    const [chaterIds, setChaterIds] = useState(null);
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const { chatHistory } = useSelector((state) => state.consultants);
    const messages = useSelector((state) => state.socket.messages);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [openMenuConversationId, setOpenMenuConversationId] = useState(null);
    const lastNotificationMessageId = useRef(null);

    const lastProcessedMessageId = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);

    // const consultantId = "691dbba35e388352e3203b0b";

    useEffect(() => {
        const clientId = localStorage.getItem('client_u_Identity');
        const shopId = localStorage.getItem('shop_o_Identity');
        setConsultantId(clientId);
        setShopId(shopId);
    }, []);

    const { userInRequest } = useSelector((state) => state.consultants);
    console.log("userInRequest", userInRequest)


    console.log("shopId______________________chatList__________________", chatList)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setShowChatView(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll to bottom function - only scroll messages area, not the whole page
    const scrollToBottom = (behavior = 'auto') => {
        if (messagesAreaRef.current) {
            // Directly set scrollTop to scroll only the messages area, not the whole page
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    };

    // Update messages from chatHistory
    useEffect(() => {
        if (chatHistory?.chatHistory) {
            setChatMessagesData(chatHistory.chatHistory);
            // Reset last processed message when chat changes
            lastProcessedMessageId.current = null;
            // Scroll to bottom when chat loads - only messages area
            setTimeout(() => {
                scrollToBottom('auto');
            }, 300);
        }
    }, [chatHistory]);

    // Auto-scroll when messages update - scroll for all messages (send or receive)
    // But only scroll the messages area, not the whole page
    useEffect(() => {
        if (chatMessagesData.length > 0 && messagesAreaRef.current) {
            // Scroll messages area to bottom when new message is added
            setTimeout(() => {
                scrollToBottom('auto');
            }, 100);
        }
    }, [chatMessagesData]);

    // Listen to socket messages and update chat in real-time
    useEffect(() => {
        if (!chaterIds || !consultantId || !messages.length) return;

        // Get the latest socket message
        const latestMessage = messages[messages.length - 1];

        // Skip if we've already processed this message
        if (latestMessage._id === lastProcessedMessageId.current) return;

        // Check if message belongs to current chat
        const isCurrentChatMessage =
            (String(latestMessage.shop_id) === String(chaterIds.shopId)) &&
            ((String(latestMessage.senderId) === String(chaterIds.userId) && String(latestMessage.receiverId) === String(consultantId)) ||
                (String(latestMessage.senderId) === String(consultantId) && String(latestMessage.receiverId) === String(chaterIds.userId)));

        if (isCurrentChatMessage) {
            // Mark this message as processed
            lastProcessedMessageId.current = latestMessage._id;

            // Add new message to chat (check for duplicates and replace temp messages)
            setChatMessagesData(prev => {
                const messageExists = prev.some(msg => msg._id === latestMessage._id);
                if (messageExists) {
                    return prev;
                }

                // Check if there's a temporary message with same text and timestamp (optimistic update)
                const tempMessageIndex = prev.findIndex(msg =>
                    msg._id?.startsWith('temp-') &&
                    msg.text === latestMessage.text &&
                    String(msg.senderId) === String(latestMessage.senderId)
                );

                if (tempMessageIndex !== -1) {
                    // Replace temp message with real message
                    const newMessages = [...prev];
                    newMessages[tempMessageIndex] = latestMessage;
                    return newMessages;
                }

                // Add new message
                return [...prev, latestMessage];
            });
        }
    }, [messages, chaterIds, consultantId]);

    useEffect(() => {
        if (selectedChat && chatList.length > 0) {
            const conversation = chatList.find(conv => conv.id === selectedChat);
            console.log(conversation)
            if (conversation) {

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);



    // Handle chat selection - on mobile, show chat view
    const handleChatSelect = (chatData) => {
        setChaterIds(chatData);
        console.log("Selected chat data", chatData);
        // Find conversation from chatList
        const conversation = chatList.find(conv =>
            conv.sender?.id === chatData.userId && conv.shop?.id === chatData.shopId
        );

        if (conversation) {
            setSelectedChat(conversation.id);
            if (isMobile) {
                setShowChatView(true);
            }
            // Prevent page scroll when selecting chat
            window.scrollTo(0, 0);
            dispatch(fetchChatHistory({ shopId: chatData.shopId, userId: chatData.userId, consultantId: consultantId }));
        }
    };

    // Handle back to list on mobile
    const handleBackToList = () => {
        setShowChatView(false);
    };

    // Find selected conversation from chatList
    // Priority: use currently selected user/shop (chaterIds) so header always matches opened chat
    const selectedConversation = chaterIds
        ? chatList.find(
            (conv) =>
                String(conv.sender?.id) === String(chaterIds.userId) &&
                String(conv.shop?.id) === String(chaterIds.shopId)
        )
        : chatList.find((conv) => conv.id === selectedChat);

    // Filter conversations based on search query
    const filteredConversations = chatList.filter(conv =>
        conv.sender?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getChatList = async () => {
        if (!shopId || !consultantId) return;

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/get/chat-list/${shopId}/${consultantId}`);
            console.log("response___ChatsPage", response)
            if (response.data?.payload) {
                setChatList(response.data.payload);
                // Auto-select first conversation and load messages
                if (response.data.payload.length > 0) {
                    const firstChat = response.data.payload[0];
                    setSelectedChat(firstChat.id);
                    // Load messages for first chat
                    // getChatMessages(firstChat);
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        getChatList();
    }, [messages, userInRequest, shopId, consultantId]);

    const sendChat = () => {
        if (text.trim() === "" || !chaterIds) return;

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
                    // alert("Connection lost. Please refresh the page.");
                }
            }, 1000);
            return;
        }

        sendMessage();

        // const {message} = 

        function sendMessage() {
            const messageData = {
                senderId: consultantId || consultantId,
                receiverId:  chaterIds?.userId,
                shop_id: shopId || chaterIds?.shopId,
                text: text,
                timestamp: new Date().toISOString()
            };
            console.log("messageData____________________SEND CHAT", messageData)
            // Optimistically add message to UI immediately
            const optimisticMessage = {
                _id: `temp-${Date.now()}`,
                ...messageData
            };
            setChatMessagesData(prev => [...prev, optimisticMessage]);

            // Send message via socket
            socket.emit("sendMessage", messageData);
            setText("");
            dispatch(addMessage(messageData))
        }
    }


    // Show notification when new message arrives
    useEffect(() => {
        if (messages && messages.length > 0) {
            // Get the latest message
            const latestMessage = messages[messages.length - 1];

            // Skip if we've already shown notification for this message
            if (latestMessage._id === lastNotificationMessageId.current) return;

            // Check if this is an incoming message (not sent by consultant)
            const isIncomingMessage = String(latestMessage.senderId) !== String(consultantId);

            // Check if message belongs to current chat (if chat is selected)
            let isCurrentChatMessage = true;
            if (chaterIds) {
                isCurrentChatMessage =
                    String(latestMessage.shop_id) === String(chaterIds.shopId) &&
                    ((String(latestMessage.senderId) === String(chaterIds.userId) && String(latestMessage.receiverId) === String(consultantId)) ||
                        (String(latestMessage.senderId) === String(consultantId) && String(latestMessage.receiverId) === String(chaterIds.userId)));
            }

            // Show notification only for incoming messages
            if (isIncomingMessage) {
                // Get sender name from chatList
                const senderConversation = chatList.find(conv =>
                    conv.sender?.id === latestMessage.senderId && conv.shop?.id === latestMessage.shop_id
                );

                const senderName = senderConversation?.sender?.fullname || 'User';
                const senderAvatar = senderConversation?.sender?.profileImage
                    ? `${process.env.REACT_APP_BACKEND_HOST}/${senderConversation.sender.profileImage.replace("\\", "/")}`
                    : null;

                // Set notification data
                setNotificationMessage({
                    senderName: senderName,
                    text: latestMessage.text,
                    avatar: senderAvatar
                });

                // Show notification
                setShowNotification(true);

                // Mark as processed
                lastNotificationMessageId.current = latestMessage._id;

                // Auto-hide after 5 seconds
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        }
    }, [messages, consultantId, chaterIds, chatList]);


    const updateUser = (conversation) => {

        dispatch(updateUserRequestById({ shopId: conversation.shop.id, userId: conversation.sender.id, consultantId: consultantId }));
    }


    // filter the request modal data
    const isRequestModalOpen = chatList.filter((conversation) => conversation.isRequest === false);
    const isRequestModalClose = chatList.filter((conversation) => conversation.isRequest === true);




    return (
        <Fragment>
            {/* Message Notification Alert */}
            {/* {showNotification && notificationMessage && (
                <PopupNotification
                    message={notificationMessage}
                    onClose={() => setShowNotification(false)}
                />
            )} */}

            <div className={styles.pageContainer}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <h1 className={styles.pageTitle}>
                        Messages
                    </h1>
                    <p className={styles.pageDescription}>
                        Communicate with clients and manage your conversations.
                    </p>
                </div>
                <div className={styles.chatLayout}>
                    {/* Conversations Sidebar */}
                    <div className={`${styles.conversationsSidebar} ${showChatView ? styles.hideOnMobile : ''}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
                            {/* Search Bar */}
                            <div className={styles.searchBar}>
                                <div className={styles.searchInputWrapper}>
                                    <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={styles.searchInput}
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "end"
                            }}>
                                <p onClick={() => setShowRequestModal(!showRequestModal)} style={{ fontSize: "14px", fontWeight: "600", padding: "10px", cursor: "pointer" }}>Request</p>
                            </div>
                            {
                                showRequestModal ? (

                                    isRequestModalOpen?.map((conversation) => {
                                        const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${conversation?.sender?.profileImage?.replace("\\", "/")}`;
                                        const isImage = conversation?.sender?.profileImage ? true : false;
                                        const updatedAt = new Date(conversation?.updatedAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true
                                        });

                                        return (
                                            <Fragment>
                                                <div
                                                    key={conversation.id}
                                                    // onClick={() => handleChatSelect({ shopId: conversation.shop.id, userId: conversation.sender.id })}
                                                    className={`${styles.conversationItem} ${selectedChat === conversation.id ? styles.conversationItemActive : ''}`}
                                                >
                                                    <div className={styles.conversationContent}>
                                                        <div className={styles.avatarWrapper}>
                                                            <img
                                                                src={isImage ? imageUrl : "../images/team/team1.avif"}
                                                                alt="profile"
                                                                className={styles.conversationAvatar}
                                                            />
                                                            {conversation.isOnline && (
                                                                <div className={styles.onlineIndicator}></div>
                                                            )}
                                                        </div>
                                                        <div className={styles.conversationDetails}>
                                                            <div className={`${styles.conversationHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                                                                <div className={styles.conversationName}>
                                                                    {conversation.sender?.fullname}
                                                                </div>
                                                                <div className={styles.conversationTimestamp}>
                                                                    {updatedAt}
                                                                </div>
                                                            </div>
                                                            <div className={`${styles.conversationMessage} ${styles.flexBetween} ${styles.flexCenter}`}>
                                                                <div className={styles.messageText}>
                                                                    {conversation?.lastMessage}
                                                                </div>

                                                                <div className={styles.moreMenuWrapper}>
                                                                    <button
                                                                        type="button"
                                                                        className={styles.unreadBadgeIcon}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setOpenMenuConversationId(
                                                                                openMenuConversationId === conversation.id ? null : conversation.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <BsThreeDotsVertical />
                                                                    </button>

                                                                    {openMenuConversationId === conversation.id && (
                                                                        <div
                                                                            className={styles.moreMenu}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                className={styles.moreMenuItem}
                                                                                onClick={() => {
                                                                                    // TODO: add your add logic here
                                                                                    // setOpenMenuConversationId(null);
                                                                                    updateUser(conversation);
                                                                                }}
                                                                            >
                                                                                Add
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className={styles.moreMenuItem}
                                                                                onClick={() => {
                                                                                    // TODO: add your remove logic here
                                                                                    console.log("Remove clicked for", conversation.id);
                                                                                    setOpenMenuConversationId(null);
                                                                                }}
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* <div className={`${styles.conversationStatus} ${conversation.isOnline ? styles.statusOnline : styles.statusOffline}`}>
                                                                {conversation.lastActive}
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })

                                )
                                    : (
                                        <div className={styles.conversationsList}>
                                            {isRequestModalClose.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                    <div>
                                                        <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                        <p className={styles.emptyText}>Loading conversations...</p>
                                                    </div>
                                                </div>
                                            ) : filteredConversations.length === 0 ? (
                                                <div className={styles.emptyState}>
                                                    <div>
                                                        <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                        <p className={styles.emptyText}>No conversations found</p>
                                                    </div>
                                                </div>
                                            ) : (

                                                isRequestModalClose?.map((conversation) => {
                                                    const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${conversation?.sender?.profileImage?.replace("\\", "/")}`;
                                                    const isImage = conversation?.sender?.profileImage ? true : false;
                                                    const updatedAt = new Date(conversation?.updatedAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true
                                                    });

                                                    return (
                                                        <Fragment>
                                                            <div
                                                                key={conversation.id}
                                                                onClick={() => handleChatSelect({ shopId: conversation.shop.id, userId: conversation.sender.id })}
                                                                className={`${styles.conversationItem} ${selectedChat === conversation.id ? styles.conversationItemActive : ''}`}
                                                            >
                                                                <div className={styles.conversationContent}>
                                                                    <div className={styles.avatarWrapper}>
                                                                        <img
                                                                            src={isImage ? imageUrl : "../images/team/team1.avif"}
                                                                            alt="profile"
                                                                            className={styles.conversationAvatar}
                                                                        />
                                                                        {conversation.isOnline && (
                                                                            <div className={styles.onlineIndicator}></div>
                                                                        )}
                                                                    </div>
                                                                    <div className={styles.conversationDetails}>
                                                                        <div className={`${styles.conversationHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                                                                            <div className={styles.conversationName}>
                                                                                {conversation.sender?.fullname}
                                                                            </div>
                                                                            <div className={styles.conversationTimestamp}>
                                                                                {updatedAt}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${styles.conversationMessage} ${styles.flexBetween} ${styles.flexCenter}`}>
                                                                            <div className={styles.messageText}>
                                                                                {conversation?.
                                                                                    lastMessage
                                                                                }
                                                                            </div>
                                                                            {/* {conversation.unreadCount > 0 && ( */}
                                                                            <span className={styles.unreadBadge}>
                                                                                {"5+"}
                                                                            </span>
                                                                            {/* )} */}
                                                                        </div>
                                                                        <div className={`${styles.conversationStatus} ${conversation.isOnline ? styles.statusOnline : styles.statusOffline}`}>
                                                                            {conversation.lastActive}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                }

                                                )
                                            )}
                                        </div>
                                    )

                            }
                            {/* Conversations List */}

                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className={`${styles.chatWindow} ${!showChatView ? styles.hideOnMobile : ''}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className={`${styles.chatHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                                        {/* Mobile Back Button */}
                                        <button
                                            className={styles.mobileBackButton}
                                            onClick={handleBackToList}
                                            aria-label="Back to conversations"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M19 12H5M12 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div className={`${styles.chatHeaderInfo} ${styles.flex} ${styles.flexCenter}`}>
                                            <div className={styles.avatarWrapper}>
                                                {selectedConversation?.sender?.profileImage ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_BACKEND_HOST}/${selectedConversation.sender.profileImage.replace("\\", "/")}`}
                                                        alt={selectedConversation.sender.fullname}
                                                        className={styles.chatHeaderAvatar}
                                                        style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className={styles.chatHeaderAvatar}>
                                                        {selectedConversation?.sender?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                {selectedConversation?.isOnline && (
                                                    <div className={styles.onlineIndicator}></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className={styles.chatHeaderName}>
                                                    {selectedConversation?.sender?.fullname || 'User'}
                                                </div>
                                                <div className={styles.chatHeaderStatus} style={{ color: selectedConversation?.isOnline ? '#10b981' : '#6c757d' }}>
                                                    {selectedConversation?.isOnline ? 'Active now' : selectedConversation?.lastActive || 'Offline'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.chatHeaderActions} style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className={styles.headerButton}
                                                title="Video Call"
                                                onClick={() => navigate('/video/calling/page', { state: { conversation: selectedConversation } })}
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
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <p>No messages yet. Start the conversation!</p>
                                            </div>
                                        ) : (
                                            <>
                                                {chatMessagesData.map((message) => {
                                                    // const consultantId = consultantId;
                                                    const isOwn = message.senderId === "691eafcff95528ab305eba59";

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
                                                                {/* {!isOwn && (
                                                                <div className={styles.messageSender}>
                                                                    User
                                                                </div>
                                                            )} */}
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
                                                value={text}
                                                type="text"
                                                className={styles.messageInput}
                                                placeholder="Type a message..."
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && text.trim()) {
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
                                </>
                            ) : (
                                <div className={styles.emptyChatState}>
                                    <div className={styles.emptyChatContent}>
                                        <svg className={styles.emptyChatIcon} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <p className={styles.emptyChatText}>Select a conversation to start chatting</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ChatsPage;
