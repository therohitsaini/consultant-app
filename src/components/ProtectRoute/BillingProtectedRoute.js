import { Navigate } from "react-router-dom";
import { useAppStatusBilling } from "../ProtectRoute/AppStatusBillingProvider";

export const BillingProtectedRoute = ({ children }) => {
    const billing = useAppStatusBilling();

    // Wait for provider and initial fetch
    if (!billing || billing.loading) return null;

    const { isPaid } = billing;

    // ACTIVE = paid → allow all routes. Not ACTIVE → show pricing only
    if (!isPaid) {
        return <Navigate to="/pricing" replace />;
    }

    return children;
};
