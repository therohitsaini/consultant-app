
// components/CustomSideMenu.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "🏠" },
        { label: "Consultants", path: "/consultant-list", icon: "👥" },
        { label: "Pricing", path: "/pricing", icon: "💰" },
        { label: "Admin Settings", path: "/admin-settings", icon: "⚙️" },
        { label: "FAQ", path: "/faq", icon: "❓" },
    ];

    return (
        <div style={{
            width: '240px',
            background: '#1f2937',
            color: 'white',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '20px'
        }}>
            <h3 style={{ marginBottom: '30px', color: '#60a5fa' }}>
                Consultant App
            </h3>

            {menuItems.map((item) => (
                <div
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: location.pathname === item.path ? '#374151' : 'transparent',
                        transition: 'background 0.3s',
                        '&:hover': {
                            background: '#374151'
                        }
                    }}
                >
                    <span style={{ marginRight: '12px', fontSize: '20px' }}>
                        {item.icon}
                    </span>
                    <span style={{ fontSize: '16px' }}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AdminMenu;