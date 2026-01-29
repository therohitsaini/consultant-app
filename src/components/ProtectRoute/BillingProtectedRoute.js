import { Navigate } from "react-router-dom";
import { useAppStatusBilling } from "./AppStatusBillingProvider";

export const BillingProtectedRoute = ({ children }) => {
    const { isPaid, loading } = useAppStatusBilling();
    console.log("isPaid", isPaid);
    console.log("loading", loading);
    if (loading) return null;

    if (!isPaid) {
     return <Navigate to="/pricing" replace />;
    }

    return children;
};
