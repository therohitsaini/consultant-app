import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './TabNavigation.module.css';
import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import ChatsPage from './ChatsPage';
import VideoCallingPage from './VideoCallingPage';
import { ChatIcon, DashboardIcon, UsersIcon } from '../FallbackData/FallbackData';
import { useDispatch } from 'react-redux';
import { connectSocket } from '../Redux/slices/sokectSlice';

// Icon Components - Enhanced with better designs





function TabNavigation({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [consultantId, setConsultantId] = useState(null);
    const dispatch = useDispatch();


    const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        if (window.parent) {
            window.parent.postMessage(
                { type: "AGORA_IFRAME_HEIGHT", height },
                "*"
            );
        }
    };

    // Add listeners for load / resize and initial timeout
    useEffect(() => {
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);

        // One-time call shortly after mount (in case content is already rendered)
        const timeoutId = setTimeout(sendHeight, 500);

        return () => {
            window.removeEventListener("load", sendHeight);
            window.removeEventListener("resize", sendHeight);
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        dispatch(connectSocket("691dbba35e388352e3203b0b"));
    }, []);

    console.log("consultantId________________", consultantId);
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

    // useEffect(() => {
    //     if (localStorage.getItem('consultant_u_Identity')) {
    //         setConsultantId(localStorage.getItem('consultant_u_Identity'));
    //     }
    // }, []);

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

