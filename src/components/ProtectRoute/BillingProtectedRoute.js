import { useEffect } from "react";
import { useAppStatusBilling } from "../ProtectRoute/AppStatusBillingProvider";
import { useAppBridge } from "../createContext/AppBridgeContext";
import { Redirect } from "@shopify/app-bridge/actions";

export const BillingProtectedRoute = ({ children }) => {
    const billing = useAppStatusBilling();
    const app = useAppBridge();

    useEffect(() => {
        if (!billing || billing.loading) return;

        if (!billing.isPaid) {
            const redirect = Redirect.create(app);

            redirect.dispatch(
                Redirect.Action.REMOTE,
                "https://admin.shopify.com/store/rohit-12345839/charges/label-node/pricing_plans"
            );
        }
    }, [billing, app]);

    if (!billing || billing.loading) return null;

    if (!billing.isPaid) return null;

    return children;
};
