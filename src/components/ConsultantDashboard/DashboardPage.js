import React from 'react';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    // Sample data - in real app, this would come from API/state
    const stats = {
        totalClients: 124,
        activeConsultations: 18,
        monthlyRevenue: 45200,
        averageRating: 4.8
    };

    const recentConsultations = [
        { id: 1, client: 'Sarah Johnson', type: 'Business Strategy', date: '2024-01-15', status: 'Active', amount: 1200 },
        { id: 2, client: 'Michael Chen', type: 'Financial Planning', date: '2024-01-14', status: 'Completed', amount: 850 },
        { id: 3, client: 'Emily Rodriguez', type: 'Marketing Consultation', date: '2024-01-13', status: 'Active', amount: 950 },
        { id: 4, client: 'David Kim', type: 'Technology Advisory', date: '2024-01-12', status: 'Scheduled', amount: 1500 },
        { id: 5, client: 'Lisa Anderson', type: 'HR Consulting', date: '2024-01-11', status: 'Completed', amount: 1100 }
    ];

    const getStatusBadge = (status) => {
        const badges = {
            'Active': styles.badgePrimary,
            'Completed': styles.badgeSuccess,
            'Scheduled': styles.badgeWarning
        };
        return badges[status] || styles.badgeSecondary;
    };

    // Simple line chart SVG data
    const chartData = [45, 52, 48, 61, 55, 68, 72, 65, 70, 75, 80, 78];

    return (
        <div className={styles.pageContainer}>
            {/* Header Section */}
            <div className={styles.headerSection}>
                <h1 className={styles.pageTitle}>
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
                                    {stats.totalClients}
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
                                    {stats.activeConsultations}
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
                                    ${(stats.monthlyRevenue / 1000).toFixed(1)}k
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

            {/* Charts and Activity Row */}
            <div className={styles.contentGrid}>
                {/* Revenue Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartCardBody}>
                        <div className={`${styles.chartHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                            <div>
                                <h5 className={styles.chartTitle}>
                                    Revenue Overview
                                </h5>
                                <p className={styles.chartSubtitle}>
                                    Last 12 months performance
                                </p>
                            </div>
                            <select className={styles.chartSelect}>
                                <option>Last 12 Months</option>
                                <option>Last 6 Months</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                        <div className={styles.chartContainer}>
                            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#4a90e2" stopOpacity="0.05" />
                                    </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1="0" y1={40 + i * 40} x2="400" y2={40 + i * 40} stroke="#e9ecef" strokeWidth="1" />
                                ))}
                                {/* Area chart */}
                                <path
                                    d={`M 0,${200 - (chartData[0] / 100) * 120} ${chartData.map((val, i) => `L ${(i + 1) * (400 / chartData.length)},${200 - (val / 100) * 120}`).join(' ')} L 400,200 L 0,200 Z`}
                                    fill="url(#chartGradient)"
                                />
                                {/* Line chart */}
                                <polyline
                                    points={chartData.map((val, i) => `${(i + 0.5) * (400 / chartData.length)},${200 - (val / 100) * 120}`).join(' ')}
                                    fill="none"
                                    stroke="#4a90e2"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Data points */}
                                {chartData.map((val, i) => (
                                    <circle
                                        key={i}
                                        cx={(i + 0.5) * (400 / chartData.length)}
                                        cy={200 - (val / 100) * 120}
                                        r="4"
                                        fill="#4a90e2"
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                ))}
                            </svg>
                        </div>
                        <div className={`${styles.chartLabels} ${styles.flexBetween}`}>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                                <span key={i}>{month}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={styles.quickStatsCard}>
                    <div className={styles.chartCardBody}>
                        <h5 className={styles.quickStatsTitle}>
                            Quick Stats
                        </h5>
                        <div className={styles.statItem}>
                            <div className={`${styles.statItemHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                                <span className={styles.textMuted} style={{ fontSize: '14px' }}>Consultations Today</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>5</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.progressPrimary}`} style={{ width: '62%' }}></div>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statItemHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                                <span className={styles.textMuted} style={{ fontSize: '14px' }}>Response Rate</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>94%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.progressSuccess}`} style={{ width: '94%' }}></div>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statItemHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                                <span className={styles.textMuted} style={{ fontSize: '14px' }}>Client Satisfaction</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>96%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.progressWarning}`} style={{ width: '96%' }}></div>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statItemHeader} ${styles.flexBetween} ${styles.flexCenter}`}>
                                <span className={styles.textMuted} style={{ fontSize: '14px' }}>Completion Rate</span>
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>88%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.progressInfo}`} style={{ width: '88%' }}></div>
                            </div>
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
                        <button className={styles.tableButton} style={{ fontSize: '13px' }}>
                            View All
                        </button>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th className={styles.tableHeadCell}>Client</th>
                                    <th className={styles.tableHeadCell}>Type</th>
                                    <th className={styles.tableHeadCell}>Date</th>
                                    <th className={styles.tableHeadCell}>Status</th>
                                    <th className={`${styles.tableHeadCell} ${styles.tableHeadCellRight}`}>Amount</th>
                                    <th className={`${styles.tableHeadCell} ${styles.tableHeadCellRight}`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentConsultations.map((consultation) => (
                                    <tr key={consultation.id} className={styles.tableRow}>
                                        <td className={styles.tableCell}>
                                            <div className={`${styles.userInfo} ${styles.flex} ${styles.flexCenter}`}>
                                                <div className={styles.userAvatar}>
                                                    {consultation.client.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className={styles.userName}>
                                                        {consultation.client}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell} style={{ fontSize: '14px', color: '#6c757d' }}>
                                            {consultation.type}
                                        </td>
                                        <td className={styles.tableCell} style={{ fontSize: '14px', color: '#6c757d' }}>
                                            {new Date(consultation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className={styles.tableCell}>
                                            <span className={`${styles.badge} ${getStatusBadge(consultation.status)}`}>
                                                {consultation.status}
                                            </span>
                                        </td>
                                        <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.amount}`}>
                                            ${consultation.amount.toLocaleString()}
                                        </td>
                                        <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                                            <button className={styles.viewButton}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
