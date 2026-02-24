import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../../components/ConsultantDashboard/TopHeadercss.module.css';

const TopHeader = ({ onMenuToggle, isSidebarOpen,profile }) => {
    const location = useLocation();
    const [searchValue, setSearchValue] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const avatarUrl = 'https://i.pravatar.cc/80?img=47';

    // Derive current section info from route
    const getPageMeta = (path) => {
        if (path.startsWith('/users-page')) {
            return {
                title: 'Users',
                subtitle: 'Manage clients & contacts',
            };
        }

        if (path.startsWith('/chats')) {
            return {
                title: 'Chats',
                subtitle: 'Conversations with your clients',
            };
        }

        if (path.startsWith('/video-call')) {
            return {
                title: 'Video Call',
                subtitle: 'Live consultation in progress',
            };
        }

        if (path.startsWith('/consultant-dashboard')) {
            return {
                title: 'Dashboard',
                subtitle: 'Overview of your consultancy',
            };
        }

        return {
            title: 'MyConsultant',
            subtitle: 'Consultant workspace',
        };
    };

    const pageMeta = getPageMeta(location.pathname);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isVideoCallPage = location.pathname === '/video-call' || location.pathname.startsWith('/video-call');
    if (isVideoCallPage) return null;

    return (
        <header className={styles.topHeader}>
            <div className={styles.headerInner}>
                {/* Left: Logo + Hamburger + Dashboard */}
                <div className={styles.headerLeft}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <span className={styles.logoLetter}>C</span>
                        </div>
                        <span className={styles.brandName}>MyConsultant</span>
                    </div>
                    <button
                        type="button"
                        className={styles.hamburgerBtn}
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                    >
                        {isSidebarOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Right: Search + Icons + Profile */}
                <div className={styles.headerRight}>
                    <div className={styles.searchBox}>
                        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search here..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            aria-label="Search"
                        />
                    </div>

                    <button type="button" className={styles.iconBtn} aria-label="Messages">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span className={styles.badge}>6</span>
                    </button>

                    <button type="button" className={styles.iconBtn} aria-label="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className={styles.badge}>4</span>
                    </button>

                    <div className={styles.userProfileWrapper} ref={profileRef}>
                        <button
                            type="button"
                            className={`${styles.userProfile} ${profileOpen ? styles.userProfileActive : ''}`}
                            onClick={() => setProfileOpen((open) => !open)}
                            aria-haspopup="true"
                            aria-expanded={profileOpen}
                        >
                            <div className={styles.avatar}>
                                <img src={"https://test-online-consultation.zend-apps.com/uploads/consultants/consultant-1771413022444.jpg"} alt="Peter Parkur" className={styles.avatarImage} />
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>Peter Parkur</span>
                                <span className={styles.userRole}>Super Admin</span>
                            </div>
                        </button>

                        {profileOpen && (
                            <div className={styles.profileDropdown}>
                                <div className={styles.profileDropdownHeader}>
                                    <div className={styles.profileDropdownAvatar}>
                                        <img src={avatarUrl} alt="Peter Parkur" className={styles.profileDropdownAvatarImage} />
                                    </div>
                                    <div className={styles.profileDropdownInfo}>
                                        <span className={styles.profileDropdownName}>Peter Parkur</span>
                                        <span className={styles.profileDropdownRole}>Super Admin</span>
                                    </div>
                                </div>

                                <div className={styles.profileDropdownList}>
                                    <button type="button" className={styles.profileDropdownItem}>
                                        <span className={`${styles.profileDropdownIcon} ${styles.profileDropdownIconProfile}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </span>
                                        <span className={styles.profileDropdownLabel}>Profile</span>
                                    </button>

                                    <button type="button" className={styles.profileDropdownItem}>
                                        <span className={`${styles.profileDropdownIcon} ${styles.profileDropdownIconInbox}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </span>
                                        <span className={styles.profileDropdownLabel}>Inbox</span>
                                    </button>

                                    <button type="button" className={styles.profileDropdownItem}>
                                        <span className={`${styles.profileDropdownIcon} ${styles.profileDropdownIconLogout}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                        </span>
                                        <span className={styles.profileDropdownLabel}>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
