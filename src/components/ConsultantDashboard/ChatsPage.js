import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatsPage.module.css';

const ChatsPage = () => {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showChatView, setShowChatView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    // Handle chat selection - on mobile, show chat view
    const handleChatSelect = (chatId) => {
        setSelectedChat(chatId);
        if (isMobile) {
            setShowChatView(true);
        }
    };

    // Handle back to list on mobile
    const handleBackToList = () => {
        setShowChatView(false);
    };

    // Sample conversations data
    const conversations = [
        {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'SJ',
            lastMessage: 'Thank you for the detailed analysis. This helps a lot!',
            timestamp: '2:30 PM',
            unreadCount: 2,
            isOnline: true,
            lastActive: 'Active now'
        },
        {
            id: 2,
            name: 'Michael Chen',
            avatar: 'MC',
            lastMessage: 'Can we schedule a follow-up meeting next week?',
            timestamp: '1:15 PM',
            unreadCount: 0,
            isOnline: true,
            lastActive: 'Active 5m ago'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            avatar: 'ER',
            lastMessage: 'I have reviewed the proposal. Looks great!',
            timestamp: '12:45 PM',
            unreadCount: 1,
            isOnline: false,
            lastActive: '2 hours ago'
        },
        {
            id: 4,
            name: 'David Kim',
            avatar: 'DK',
            lastMessage: 'The implementation plan is ready for review.',
            timestamp: '11:20 AM',
            unreadCount: 0,
            isOnline: false,
            lastActive: '3 hours ago'
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            avatar: 'LA',
            lastMessage: 'Thanks for your help with the strategy session.',
            timestamp: 'Yesterday',
            unreadCount: 0,
            isOnline: true,
            lastActive: 'Active now'
        },
        {
            id: 6,
            name: 'James Wilson',
            avatar: 'JW',
            lastMessage: 'Looking forward to our consultation.',
            timestamp: 'Yesterday',
            unreadCount: 3,
            isOnline: false,
            lastActive: '1 day ago'
        },
        {
            id: 7,
            name: 'Maria Garcia',
            avatar: 'MG',
            lastMessage: 'The documents have been sent. Please review.',
            timestamp: '2 days ago',
            unreadCount: 0,
            isOnline: false,
            lastActive: '2 days ago'
        }
    ];

    // Sample messages for selected chat
    const messages = {
        1: [
            { id: 1, sender: 'Sarah Johnson', text: 'Hello! I wanted to discuss the business strategy proposal.', timestamp: '10:15 AM', isOwn: false },
            { id: 2, sender: 'You', text: 'Hi Sarah! I\'d be happy to help. What specific aspects would you like to focus on?', timestamp: '10:16 AM', isOwn: true },
            { id: 3, sender: 'Sarah Johnson', text: 'I\'m particularly interested in the market analysis section and competitive positioning.', timestamp: '10:18 AM', isOwn: false },
            { id: 4, sender: 'You', text: 'Great! I\'ve prepared a comprehensive analysis. Let me share the key findings with you.', timestamp: '10:20 AM', isOwn: true },
            { id: 5, sender: 'You', text: 'The market analysis shows strong growth potential in your target segment. We\'ve identified three key competitors and their positioning strategies.', timestamp: '10:22 AM', isOwn: true },
            { id: 6, sender: 'Sarah Johnson', text: 'That sounds excellent. Can you send me the detailed report?', timestamp: '10:25 AM', isOwn: false },
            { id: 7, sender: 'You', text: 'Absolutely! I\'ll send it over within the next hour.', timestamp: '10:26 AM', isOwn: true },
            { id: 8, sender: 'Sarah Johnson', text: 'Thank you for the detailed analysis. This helps a lot!', timestamp: '2:30 PM', isOwn: false }
        ],
        2: [
            { id: 1, sender: 'Michael Chen', text: 'Hi, can we schedule a follow-up meeting?', timestamp: '1:10 PM', isOwn: false },
            { id: 2, sender: 'You', text: 'Of course! What time works best for you?', timestamp: '1:12 PM', isOwn: true },
            { id: 3, sender: 'Michael Chen', text: 'Can we schedule a follow-up meeting next week?', timestamp: '1:15 PM', isOwn: false }
        ]
    };

    const selectedConversation = conversations.find(conv => conv.id === selectedChat);
    const chatMessages = messages[selectedChat] || [];

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',  }}>
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
                            {filteredConversations.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div>
                                        <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <p className={styles.emptyText}>No conversations found</p>
                                    </div>
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => {
                                    console.log("_____", conversation)
                                    return (
                                        <div
                                            key={conversation.id}
                                            onClick={() => handleChatSelect(conversation.id)}
                                            className={`${styles.conversationItem} ${selectedChat === conversation.id ? styles.conversationItemActive : ''}`}
                                        >
                                            <div className={styles.conversationContent}>
                                                <div className={styles.avatarWrapper}>
                                                    <div className={styles.conversationAvatar}>
                                                        {conversation.avatar}
                                                    </div>
                                                    {conversation.isOnline && (
                                                        <div className={styles.onlineIndicator}></div>
                                                    )}
                                                </div>
                                                <div className={styles.conversationDetails}>
                                                    <div className={`${styles.conversationHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                                                        <div className={styles.conversationName}>
                                                            {conversation.name}
                                                        </div>
                                                        <div className={styles.conversationTimestamp}>
                                                            {conversation.timestamp}
                                                        </div>
                                                    </div>
                                                    <div className={`${styles.conversationMessage} ${styles.flexBetween} ${styles.flexCenter}`}>
                                                        <div className={styles.messageText}>
                                                            {conversation.lastMessage}
                                                        </div>
                                                        {conversation.unreadCount > 0 && (
                                                            <span className={styles.unreadBadge}>
                                                                {conversation.unreadCount}
                                                            </span>
                                                        )}
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
                                            <div className={styles.chatHeaderAvatar}>
                                                {selectedConversation.avatar}
                                            </div>
                                            {selectedConversation.isOnline && (
                                                <div className={styles.onlineIndicator}></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className={styles.chatHeaderName}>
                                                {selectedConversation.name}
                                            </div>
                                            <div className={styles.chatHeaderStatus} style={{ color: selectedConversation.isOnline ? '#10b981' : '#6c757d' }}>
                                                {selectedConversation.lastActive}
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
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`${styles.messageContainer} ${message.isOwn ? styles.messageContainerRight : styles.messageContainerLeft}`}
                                        >
                                            <div className={`${styles.messageBubble} ${message.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther}`}>
                                                {!message.isOwn && (
                                                    <div className={styles.messageSender}>
                                                        {message.sender}
                                                    </div>
                                                )}
                                                <div className={styles.messageText}>
                                                    {message.text}
                                                </div>
                                                <div className={styles.messageTimestamp}>
                                                    {message.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                            type="text"
                                            className={styles.messageInput}
                                            placeholder="Type a message..."
                                        />
                                        <button className={styles.sendButton} title="Send">
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
