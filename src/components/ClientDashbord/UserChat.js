import React, { Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import styles from './UserChat.module.css';
import styles from "./UserChat.module.css"

const UserChat = () => {
    const navigate = useNavigate();

    // Sample conversation data
    const selectedConversation = {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        isOnline: true,
        lastActive: 'Active now'
    };

    // Sample messages
    const chatMessages = [
        { id: 1, sender: 'Sarah Johnson', text: 'Hello! I wanted to discuss the business strategy proposal.', timestamp: '10:15 AM', isOwn: false },
        { id: 2, sender: 'You', text: 'Hi Sarah! I\'d be happy to help. What specific aspects would you like to focus on?', timestamp: '10:16 AM', isOwn: true },
        { id: 3, sender: 'Sarah Johnson', text: 'I\'m particularly interested in the market analysis section and competitive positioning.', timestamp: '10:18 AM', isOwn: false },
        { id: 4, sender: 'You', text: 'Great! I\'ve prepared a comprehensive analysis. Let me share the key findings with you.', timestamp: '10:20 AM', isOwn: true },
        { id: 5, sender: 'You', text: 'The market analysis shows strong growth potential in your target segment. We\'ve identified three key competitors and their positioning strategies.', timestamp: '10:22 AM', isOwn: true },
        { id: 6, sender: 'Sarah Johnson', text: 'That sounds excellent. Can you send me the detailed report?', timestamp: '10:25 AM', isOwn: false },
        { id: 7, sender: 'You', text: 'Absolutely! I\'ll send it over within the next hour.', timestamp: '10:26 AM', isOwn: true },
        { id: 8, sender: 'Sarah Johnson', text: 'Thank you for the detailed analysis. This helps a lot!', timestamp: '2:30 PM', isOwn: false }
    ];
    const consultantId = useParams()
    console.log("consultantId________________Consultant", consultantId);
    

    return (
        <Fragment>
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
                                <div className={styles.chatHeaderActions}>
                                    <button
                                        className={styles.headerButton}
                                        title="Video Call"
                                        onClick={() => navigate('/video-call', { state: { conversation: selectedConversation } })}
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
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UserChat;

