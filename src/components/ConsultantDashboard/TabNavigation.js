import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../components/ConsultantDashboard/TabNavigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../Redux/slices/sokectSlice";
import { fetchConsultantById } from "../Redux/slices/ConsultantSlices";
import ConsultantProfileModal from "./ConsultantProfileModal";
import axios from "axios";
import {
  HiOutlineSquares2X2,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentList,
  HiOutlineBanknotes,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import TopHeader from "./TopHeader";
import defaultImage from "../../assets/5987811.webp";

function TabNavigation({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [shopId, setShopId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profileImage: null,
  });
  const { consultantOverview } = useSelector((state) => state.consultants);
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setUserId(localStorage.getItem("client_u_Identity__"));
    setShopId(localStorage.getItem("shop_o_Identity__"));
  }, []);

  const sendHeight = () => {
    const height = document.documentElement.scrollHeight;
    if (window.parent) {
      window.parent.postMessage({ type: "AGORA_IFRAME_HEIGHT", height }, "*");
    }
  };
  useEffect(() => {
    dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: userId }));
  }, [shopId, userId]);

  const updateProfileDeatailsHandler = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("consultantId", userId);
      formData.append("shopId", shopId);
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("gender", profile.gender);
      formData.append("profileImage", profile.profileImage);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Profile updated:", response.data);

      if (response.data.success) {
        dispatch(
          fetchConsultantById({
            shop_id: shopId,
            consultant_id: userId,
            token,
            shop,
          }),
        );
        setLoading(false);
        setShowModal(false);
      }

      console.log("Profile updated:", response.data);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("shop");
        window.top.location.href = `https://${shop}/apps/consultant-theme/login`;
      }
      console.error("Error updating profile details:", error);
      setLoading(false);
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
      if (
        location.pathname !== "/consulant-chats" &&
        !location.pathname.startsWith("/consulant-chats")
      ) {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/consultant-dashboard",
      active: location.pathname === "/consultant-dashboard",
      icon: <HiOutlineSquares2X2 />,
    },
    {
      label: "Chats",
      path: "/consultant-dashboard/chats",
      active: location.pathname.startsWith("/consultant-dashboard/chats"),
      icon: <HiOutlineChatBubbleLeftRight />,
    },
    {
      label: "Call Chat Logs",
      path: "/consultant-dashboard/call-chat-logs",
      active: location.pathname.startsWith(
        "/consultant-dashboard/call-chat-logs",
      ),
      icon: <HiOutlineClipboardDocumentList />,
    },
    {
      label: "Wallet Management",
      path: "/consultant-dashboard/consultant-wallet-logs",
      active: location.pathname.startsWith(
        "/consultant-dashboard/consultant-wallet-logs",
      ),
      icon: <HiOutlineBanknotes />,
    },

    {
      label: "Withdrawal Request",
      path: "/consultant-dashboard/withdrawal-request-table",
      active: location.pathname.startsWith(
        "/consultant-dashboard/withdrawal-request-table",
      ),
      icon: <HiOutlineArrowDownTray />,
    },
  ];

  const handleNavigation = (path) => {
    localStorage.setItem("lastRoute", path); // save route
    navigate(path);
  };
  useEffect(() => {
    const lastRoute = localStorage.getItem("lastRoute");

    if (lastRoute && location.pathname === "/consultant-dashboard") {
      navigate(lastRoute, { replace: true });
    }
  }, []);

  const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${consultantOverview?.consultant?.profileImage?.replace("\\", "/")}`;
  const isVideoCallPage =
    location.pathname === "/video-call" ||
    location.pathname.startsWith("/video-call");

  const handleLogout = () => {
    console.log("User logged out");
  };
  return (
    <Fragment>
      <ConsultantProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onLogout={handleLogout}
        consultantOverview={consultantOverview}
        profile={profile}
        setProfile={setProfile}
        updateProfileDeatailsHandler={updateProfileDeatailsHandler}
        loading={loading}
      />

      <div
        className={`${styles.dashboardWrapper} ${isVideoCallPage ? styles.videoCallMode : ""}`}
      >
        <TopHeader
          onMenuToggle={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          profile={imageUrl}
          userName={consultantOverview?.consultant?.fullname}
          userEmail={consultantOverview?.consultant?.email}
          shop={shop}
        />
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className={styles.mobileOverlay} onClick={toggleSidebar}></div>
        )}

        <div className={styles.mainContainer}>
          {!isVideoCallPage && (
            <aside
              className={`${styles.sideNav} ${sidebarOpen ? styles.sideNavOpen : ""}`}
            >
              <div className={styles.profileSection}>
                <div className={styles.profileImage}>
                  <img
                    src={imageUrl ? imageUrl : defaultImage}
                    alt={consultantOverview?.consultant?.fullname}
                  />
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.profileName}>
                    {consultantOverview?.consultant?.fullname}
                  </div>
                  <div className={styles.profileEmail}>
                    {consultantOverview?.consultant?.email}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className={styles.profileButton}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
                        className={`${styles.navTab} ${item.active ? styles.navTabActive : ""}`}
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

          <div className={styles.contentArea}>
            <main className={styles.content}>
              <Outlet context={{ shop }} />
            </main>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TabNavigation;
