import React, { use, useEffect, useState } from 'react';
import styles from '../../components/ConsultantDashboard/DashboardPage.module.css';
import { fetchConsultantById } from '../Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const DashboardPage = () => {
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [shopId, setShopId] = useState(null);
    const dispatch = useDispatch();
    const { consultantOverview } = useSelector((state) => state.consultants);
    console.log("consultantOverview________________", consultantOverview)
    console.log("userData________________", userId)
    useEffect(() => {
        const storedUserId = localStorage.getItem('client_u_Identity');
        setUserId(storedUserId);
        setShopId(localStorage.getItem('shop_o_Identity'));
    }, []);

    useEffect(() => {
        if (shopId && userId) {
            dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: userId }));
        }
    }, [shopId, userId]);
    const stats = {
        totalClients: 124,
        activeConsultations: 18,
        monthlyRevenue: 45200,
        averageRating: 4.8
    };



    const getStatusBadge = (status) => {
        const badges = {
            'true': styles.badgeSuccess,
            'false': styles.badgeSecondary,
        };
        return badges[status] || styles.badgeSecondary;
    };

    // Simple line chart SVG data
    const getLatestUser = async () => {
        if (!userId) return console.log("userId not found")
        try {
            const url = `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/get/consultant/${userId}`;
            console.log("url________________", url)
            const response = await axios.get(url);
            const data = await response.data;
            console.log("Latest User Data:", data);
            // if (response.ok) {
            console.log("   ", data?.payload)
            setUserData(data?.payload);
            // }
        } catch (error) {
            return "Consultant";
        }
    }
    useEffect(() => {
        getLatestUser();
    }, [userId]);
    const formatAmount = (num) => {
        if (!num) return "0";

        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";

        // 👇 below 1000 — max 2 decimals, no extra zeros
        return Number(num.toFixed(2)).toString();
    };


    return (
        <div className={styles.pageContainer}>
            {/* Header Section */}
            <div className={styles.headerSection}>
                <h1 onClick={() => getLatestUser()} className={styles.pageTitle}>
                    Dashboard Overview
                </h1>
                <p className={styles.pageDescription}>
                    Welcome back! Here's what's happening with your consultancy today.
                </p>
            </div>

            {/* Stats Cards Row */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statCardBody}>
                        <div className={`${styles.statHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                            <div>
                                <p className={styles.statLabel}>
                                    Total Clients
                                </p>
                                <h3 className={styles.statValue}>
                                    {userData?.length || 0}
                                </h3>
                            </div>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                        <div className={`${styles.statFooter} ${styles.flex} ${styles.flexCenter}`}>
                            <span className={`${styles.statChange} ${styles.statChangeSuccess}`} style={{ fontSize: '13px', fontWeight: '600' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}>
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                                +12% from last month
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statCardBody}>
                        <div className={`${styles.statHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                            <div>
                                <p className={styles.statLabel}>
                                    Active Consultations
                                </p>
                                <h3 className={styles.statValue}>
                                    {userData?.filter(consultation => consultation.isActive).length || 0}
                                </h3>
                            </div>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className={`${styles.statFooter} ${styles.flex} ${styles.flexCenter}`}>
                            <span className={`${styles.statChange} ${styles.textPrimary}`} style={{ fontSize: '13px', fontWeight: '600' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                8 pending reviews
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statCardBody}>
                        <div className={`${styles.statHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                            <div>
                                <p className={styles.statLabel}>
                                    Monthly Revenue
                                </p>
                                <h3 className={styles.statValue}>
                                    ${consultantOverview?.consultant?.walletBalance ? formatAmount(consultantOverview?.consultant?.walletBalance) : ""}
                                </h3>
                            </div>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                        </div>
                        <div className={`${styles.statFooter} ${styles.flex} ${styles.flexCenter}`}>
                            <span className={`${styles.statChange} ${styles.statChangeSuccess}`} style={{ fontSize: '13px', fontWeight: '600' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginRight: '4px' }}>
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                                +18% from last month
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statCardBody}>
                        <div className={`${styles.statHeader} ${styles.flexBetween} ${styles.flexStart}`}>
                            <div>
                                <p className={styles.statLabel}>
                                    Average Rating
                                </p>
                                <h3 className={styles.statValue}>
                                    {stats.averageRating}
                                </h3>
                            </div>
                            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                        </div>
                        <div className={`${styles.statFooter} ${styles.flex} ${styles.flexCenter}`}>
                            <div className={styles.flex}>
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(stats.averageRating) ? "#ffc107" : "#e9ecef"} stroke={i < Math.floor(stats.averageRating) ? "#ffc107" : "#e9ecef"} style={{ marginRight: '2px' }}>
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>
                            <span className={styles.textMuted} style={{ fontSize: '13px', marginLeft: '8px' }}>
                                Based on 89 reviews
                            </span>
                        </div>
                    </div>
                </div>
            </div>



            {/* Recent Consultations */}
            <div className={styles.tableCard}>
                <div className={styles.tableCardBody}>
                    <div className={`${styles.tableHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                        <div>
                            <h5 className={styles.tableTitle}>
                                Recent Consultations
                            </h5>
                            <p className={styles.tableSubtitle}>
                                Latest client interactions and consultations
                            </p>
                        </div>

                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th className={styles.tableHeadCell}>Client</th>
                                    <th className={styles.tableHeadCell}>Type</th>
                                    <th className={styles.tableHeadCell}>Date</th>
                                    <th className={styles.tableHeadCell}>Status</th>
                                    <th className={`${styles.tableHeadCell} ${styles.tableHeadCellRight}`}>isRequest</th>
                                    <th className={`${styles.tableHeadCell} ${styles.tableHeadCellRight}`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userData?.map((consultation) => {
                                        console.log("Consultation Record:", consultation);
                                        return (
                                            <tr key={consultation._id} className={styles.tableRow}>
                                                <td className={styles.tableCell}>
                                                    <div className={`${styles.userInfo} ${styles.flex} ${styles.flexCenter}`}>
                                                        <div className={styles.userAvatar}>
                                                            {consultation.fullname
                                                                ?.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </div>
                                                        <div>
                                                            <div className={styles.userName}>
                                                                {consultation.fullname}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td
                                                    className={styles.tableCell}
                                                    style={{ fontSize: "14px", color: "#6c757d" }}
                                                >
                                                    {consultation.userType}
                                                </td>

                                                <td
                                                    className={styles.tableCell}
                                                    style={{ fontSize: "14px", color: "#6c757d" }}
                                                >
                                                    {new Date(consultation.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </td>

                                                <td className={styles.tableCell}>
                                                    <span
                                                        className={`${styles.badge} ${getStatusBadge(
                                                            consultation.isActive
                                                        )}`}
                                                    >
                                                        {consultation.
                                                            isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`${styles.tableCell} ${styles.tableCellRight} ${styles.amount}`}
                                                >
                                                    {consultation?.isRequest ? "Request" : "listed"}
                                                </td>

                                                <td
                                                    className={`${styles.tableCell} ${styles.tableCellRight}`}
                                                >
                                                    <button className={styles.viewButton}>View</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
