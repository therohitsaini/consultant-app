import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatsPage.module.css';
import axios from 'axios';
import { socket } from '../Sokect-io/SokectConfig';

const ChatsPage = () => {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showChatView, setShowChatView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [chatMessagesData, setChatMessagesData] = useState([]);
    const [consultantId, setConsultantId] = useState(null);
    const [chaterIds, setChaterIds] = useState(null);
    const [text, setText] = useState('');

    useEffect(() => {

        if (localStorage.getItem('consultant_u_Identity')) {
            setConsultantId(localStorage.getItem('consultant_u_Identity'));
        }

    }, []);
    console.log("consultantId_____________________", consultantId)
    // Check if mobile on mount and resize
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



    const getChatMessages = async (consultantId, shopId, userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/chat/get/chat-history/${shopId}/${userId}/${consultantId}`);
            if (response.data?.success) {
                setChatMessagesData(response.data?.chatHistory);
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    // Load messages when selectedChat changes
    useEffect(() => {
        if (selectedChat && chatList.length > 0) {
            const conversation = chatList.find(conv => conv.id === selectedChat);
            if (conversation) {
                getChatMessages("691dbba35e388352e3203b0b", conversation.shop.id, conversation.sender.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    console.log("chatMessagesData", chatMessagesData)

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
            getChatMessages(conversation);
        }
    };

    // Handle back to list on mobile
    const handleBackToList = () => {
        setShowChatView(false);
    };

    // Find selected conversation from chatList
    const selectedConversation = chatList.find(conv => conv.id === selectedChat);

    // Filter conversations based on search query
    const filteredConversations = chatList.filter(conv =>
        conv.sender?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getChatList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/get/chat-list/${"690c374f605cb8b946503ccb"}/${"691dbba35e388352e3203b0b"}`);
            if (response.data?.payload) {
                setChatList(response.data.payload);
                // Auto-select first conversation and load messages
                if (response.data.payload.length > 0) {
                    const firstChat = response.data.payload[0];
                    setSelectedChat(firstChat.id);
                    // Load messages for first chat
                    getChatMessages(firstChat);
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        getChatList();
    }, []);

    console.log("chaterIds____________", chaterIds)
    const sendChat = () => {
        if (text.trim() === "") return;
        const messageData = {
            senderId: "691dbba35e388352e3203b0b",
            receiverId:chaterIds?.userId,
            shop_id: chaterIds?.shopId,
            text: text,
            timestamp: new Date().toISOString()
        };
        socket.emit("sendMessage", messageData);
        setText("");
    }
    console.log("text", text)




    return (
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

                        {/* Conversations List */}
                        <div className={styles.conversationsList}>
                            {chatList.length === 0 ? (
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

                                chatList?.map((conversation) => {
                                    console.log("_____", conversation)
                                    const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${conversation?.sender?.profileImage?.replace("\\", "/")}`;
                                    const isImage = conversation?.sender?.profileImage ? true : false;
                                    const updatedAt = new Date(conversation?.updatedAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    });

                                    return (
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
                                    )
                                }

                                )
                            )}
                        </div>
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
                                <div className={styles.messagesArea}>
                                    {chatMessagesData.length === 0 ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        chatMessagesData.map((message) => {
                                            const consultantId = "691f4b774af4ade88ed7676a";
                                            const isOwn = message.senderId === consultantId;

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
                                        })
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
                                            type="text"
                                            className={styles.messageInput}
                                            placeholder="Type a message..."
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
    );
};

export default ChatsPage;
