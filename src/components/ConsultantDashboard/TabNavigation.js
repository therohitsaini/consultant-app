import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../components/ConsultantDashboard/TabNavigation.module.css';
import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import ChatsPage from './ChatsPage';
import VideoCallingPage from './VideoCallingPage';
import { ChatIcon, DashboardIcon, UsersIcon } from '../FallbackData/FallbackData';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket } from '../Redux/slices/sokectSlice';
import { fetchConsultantById } from '../Redux/slices/ConsultantSlices';
import IncomingCallAlert from '../AlertModel/IncommingCallAlert';
import ConsultantProfileModal from './ConsultantProfileModal';
import axios from 'axios';
import { app } from '@shopify/app-bridge/actions/Print';

// Icon Components - Enhanced with better designs





function TabNavigation({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [consultantId, setConsultantId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [shopId, setShopId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        profileImage: null,
    });
    console.log("profile________________", profile)
    const { consultantOverview } = useSelector((state) => state.consultants);
    console.log("consultantOverview________________", consultantOverview)
    useEffect(() => {
        setUserId(localStorage.getItem('client_u_Identity'));
        setShopId(localStorage.getItem('shop_o_Identity'));
    }, []);


    const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        if (window.parent) {
            window.parent.postMessage(
                { type: "AGORA_IFRAME_HEIGHT", height },
                "*"
            );
        }
    };
    useEffect(() => {
        dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: userId }));
    }, [shopId, userId]);

    const updateProfileDeatailsHandler = async () => {
        console.log("profile________________TTTTTTT", profile.profileImage)
        try {
            const formData = new FormData();

            formData.append("consultantId", userId);
            formData.append("shopId", shopId);
            formData.append("name", profile.name);
            formData.append("email", profile.email);
            formData.append("phone", profile.phone);
            formData.append("gender", profile.gender);

            // if (profile.profileImage) {
            //     if (profile.profileImage instanceof File) {
            //         formData.append("profileImage", profile.profileImage);

            //     } else if (typeof profile.profileImage === "string" && profile.profileImage.startsWith("blob:")) {

            //         const res = await fetch(profile.profileImage);
            //         const blob = await res.blob();

            //         const file = new File([blob], "profile.png", {
            //             type: blob.type
            //         });  

            //         formData.append("profileImage", file);
            //     }
            // }

            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/update-profile`,
                formData,

            );
            console.log("Profile updated:", response.data);

            if (response.data.success) {
                dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: userId }));
            }

            console.log("Profile updated:", response.data);
        } catch (error) {
            console.error("Error updating profile details:", error);
        }
    };


    useEffect(() => {
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        const timeoutId = setTimeout(sendHeight, 500);
        return () => {
            window.removeEventListener("load", sendHeight);
            window.removeEventListener("resize", sendHeight);
            clearTimeout(timeoutId);
        };
    }, []);



    useEffect(() => {
        dispatch(connectSocket(userId));
    }, [userId]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get("page");
        if (page === "consulant-chats") {
            if (location.pathname !== "/consulant-chats" && !location.pathname.startsWith("/consulant-chats")) {
                setTimeout(() => {
                    navigate("/consulant-chats", { replace: true });
                }, 100);
            }
        }
    }, [location.search, location.pathname, navigate]);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

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

    // const menuItems = [
    //     {
    //         label: 'Dashboard',
    //         icon: <DashboardIcon />,
    //         path: '/consultant-dashboard',
    //         active: location.pathname === '/consultant-dashboard'
    //     },

    //     {
    //         label: 'Chats',
    //         icon: <ChatIcon />,
    //         path: '/consultant-chats-section',
    //         active: location.pathname === '/consultant-chats-section'
    //     },

    // ];
    const menuItems = [
        {
            label: 'Dashboard',
            path: '/consultant-dashboard/dashboard',
            active: location.pathname === '/consultant-dashboard/dashboard',
        },
        {
            label: 'Chats',
            path: '/consultant-dashboard/chats',
            active: location.pathname.startsWith('/consultant-dashboard/chats'),
        },
    ];


    // const handleNavigation = (path) => {
    //     const params = new URLSearchParams(window.location.search);
    //     const shop = params.get("shop");
    //     const targetShop = shop;
    //     const hostQuery = "";
    //     console.log("targetShop", targetShop, "hostQuery", hostQuery)
    //     window.top.location.href = `https://${targetShop}/apps/consultant-theme${path}${hostQuery}`;

    // };
    const handleNavigation = (path) => {
        navigate(path);
    };

    const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${consultantOverview?.consultant?.profileImage?.replace("\\", "/")}`;
    const isVideoCallPage = location.pathname === '/video-call' || location.pathname.startsWith('/video-call');

    const handleLogout = () => {
        console.log("User logged out");
    };
    return (
        <Fragment>
            <  ConsultantProfileModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onLogout={handleLogout}
                consultantOverview={consultantOverview}
                profile={profile}
                setProfile={setProfile}
                updateProfileDeatailsHandler={updateProfileDeatailsHandler}

            />
            <div className={`${styles.dashboardWrapper} ${isVideoCallPage ? styles.videoCallMode : ''}`}>
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
                                    <img src={imageUrl || 'https://imgs.search.brave.com/9rELSNB2JEASiZPQlCef36aaHliToZj5fynVvObLBKg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS8x/MjgvNTk4Ny81OTg3/ODExLnBuZw'} alt={consultantOverview?.consultant?.fullname} />
                                </div>
                                <div className={styles.profileDetails}>
                                    <div className={styles.profileName}>{consultantOverview?.consultant?.fullname}</div>
                                    <div className={styles.profileEmail}>{consultantOverview?.consultant?.email}</div>
                                </div>
                                <button onClick={() => setShowModal(true)} className={styles.profileButton}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    My Profile
                                </button>
                            </div>

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
                                } else if (path === '/consulant-chats' || path.startsWith('/consulant-chats')) {
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
        </Fragment>
    );
}

export default TabNavigation;

