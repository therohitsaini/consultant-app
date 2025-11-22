import React from 'react';
import { NavMenu } from '@shopify/app-bridge-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppBridge } from './createContext/AppBridgeContext';

export default function AppNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const app = useAppBridge();

    // Handle NavMenu clicks to use React Router (SPA) and avoid full reload
    const handleMenuClick = (e, href) => {
        e.preventDefault();
        if (href !== location.pathname) {
            navigate(href);
        }
    };

    // Always render NavMenu - Shopify will show/hide it based on embedding
    // This component should be placed at App level, outside any Frame
    return (
        <NavMenu>
            {/* first child: rel="home" required, not shown as link */}
            <a href="/" rel="home" onClick={(e) => handleMenuClick(e, "/")}>Home</a>
            
            {/* other links must be <a href="...">. Intercept clicks */}
            <a href="/dashboard" onClick={(e) => handleMenuClick(e, "/dashboard")}>Dashboard</a>
            <a href="/consultant-list" onClick={(e) => handleMenuClick(e, "/consultant-list")}>Consultant List</a>
            <a href="/add-consultant" onClick={(e) => handleMenuClick(e, "/add-consultant")}>Add Consultant</a>
            <a href="/pricing" onClick={(e) => handleMenuClick(e, "/pricing")}>Pricing</a>
            <a href="/faq" onClick={(e) => handleMenuClick(e, "/faq")}>Faq</a>
        </NavMenu>
    );
}

