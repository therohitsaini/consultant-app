import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './TabNavigation.module.css';
import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import ChatsPage from './ChatsPage';
import VideoCallingPage from './VideoCallingPage';

// Icon Components - Enhanced with better designs
const DashboardIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
);

const UsersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ChatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const DollarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const HelpCircleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);


function TabNavigation({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/consultant-dashboard',
            active: location.pathname === '/consultant-dashboard'
        },
        {
            label: 'Users',
            icon: <UsersIcon />,
            path: '/users-page',
            active: location.pathname === '/users-page'
        },
        {
            label: 'Chats',
            icon: <ChatIcon />,
            path: '/chats',
            active: location.pathname === '/chats'
        },
    ];

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            }
        }
    };

    // Check if we're on video call page - hide sidebar
    const isVideoCallPage = location.pathname === '/video-call' || location.pathname.startsWith('/video-call');

    return (
        <div className={`${styles.dashboardWrapper} ${isVideoCallPage ? styles.videoCallMode : ''}`}>
            {/* Mobile Toggle Button */}
            <button 
                className={styles.mobileToggleButton}
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {sidebarOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <>
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className={styles.mobileOverlay}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Container with Navigation Tabs */}
            <div className={styles.mainContainer}>
                {/* Side Navigation Tabs - Hide on video call page */}
                {!isVideoCallPage && (
                <aside className={`${styles.sideNav} ${sidebarOpen ? styles.sideNavOpen : ''}`}>
                    {/* Profile Section */}
                    <div className={styles.profileSection}>
                        <div className={styles.profileImage}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className={styles.profileDetails}>
                            <div className={styles.profileName}>James Supardi</div>
                            <div className={styles.profileEmail}>james@example.com</div>
                        </div>
                        <button className={styles.profileButton}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            My Profile
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className={styles.navTabs}>
                        <ul className={styles.navTabList}>
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        className={`${styles.navTab} ${item.active ? styles.navTabActive : ''}`}
                                        onClick={() => handleNavigation(item.path)}
                                        title={item.label}
                                    >
                                        <span className={styles.navTabIcon}>{item.icon}</span>
                                        <span className={styles.navTabLabel}>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                )}

                {/* Main Content Area */}
                <div className={styles.contentArea}>
                    <main className={styles.content}>
                        {(() => {
                            const path = location.pathname;
                            if (path === '/users-page' || path.startsWith('/users-page')) {
                                return <UsersPage />;
                            } else if (path === '/chats' || path.startsWith('/chats')) {
                                return <ChatsPage />;
                            } else if (path === '/video-call' || path.startsWith('/video-call')) {
                                return <VideoCallingPage />;
                            } else {
                                return <DashboardPage />;
                            }
                        })()}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default TabNavigation;

