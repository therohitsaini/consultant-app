// components/ProtectAdminRoute.js.js
import { Spinner } from "@shopify/polaris";
import { Navigate } from "react-router-dom";

const ProtectAdminRoute = ({ installed, children }) => {
    if (!installed) {
        return
         (
            <div style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#f6f6f7",
                gap: "24px",
            }}>
                <Spinner accessibilityLabel="Spinner example" size="large" />;
            </div>
        );
    }

    return children;
};

export default ProtectAdminRoute
