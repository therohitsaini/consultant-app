// import React from "react";
// import { useAppBridge } from "../createContext/AppBridgeContext";

// const AdminProtectRoute = ({ children }) => {
//     const app = useAppBridge();

//     if (!app) {
//         // Invalid access → show message instead of rendering children
//         return (
//             <div style={{ padding: 40, textAlign: "center" }}>
//                 <h2>Unauthorized Access</h2>
//                 <p>This app must be opened from Shopify Admin.</p>
//             </div>
//         );
//     }

//     return children;
// };

// export default AdminProtectRoute;
// AdminProtectRoute.js - UPDATED
import React from "react";
import { useAppBridge } from "../createContext/AppBridgeContext";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectRoute = ({ children }) => {
    const { app, params, isShopifyAdmin } = useAppBridge();
    const location = useLocation();

    // ✅ Allow time for context to load
    if (!params) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h3>Loading app...</h3>
                <p>Please wait while we verify your access.</p>
            </div>
        );
    }

    // ✅ If not in Shopify Admin, redirect to Shopify
    if (!isShopifyAdmin) {
        // Check if we have saved params (page navigation case)
        const savedShop = localStorage.getItem("shopify_shop");
        const savedHost = localStorage.getItem("shopify_host");

        if (savedShop && savedHost) {
            // Reconstruct Shopify URL with hash navigation
            const redirectPath = `/?shop=${savedShop}&host=${savedHost}&embedded=1${location.pathname !== '/' ? `#${location.pathname}` : ''}`;
            window.location.href = redirectPath;
            return null;
        }

        // Show error for direct access
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h2>Unauthorized Access</h2>
                <p>This app must be opened from Shopify Admin.</p>
                <p>
                    <a href={`https://${savedShop || 'your-store'}.myshopify.com/admin/apps`}>
                        Open from Shopify Admin
                    </a>
                </p>
            </div>
        );
    }

    // ✅ Render children if we have App Bridge OR valid params
    // (App Bridge might be null in some cases but params exist)
    if (!app && isShopifyAdmin) {
        console.warn("App Bridge is null but Shopify params exist. Continuing anyway...");
    }

    return children;
};

export default AdminProtectRoute;