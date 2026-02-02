import { useEffect } from "react";
import { useAppStatusBilling } from "../ProtectRoute/AppStatusBillingProvider";
import { useAppBridge } from "../createContext/AppBridgeContext";
import { Redirect } from "@shopify/app-bridge/actions";

export const BillingProtectedRoute = ({ children }) => {
    const billing = useAppStatusBilling();
    const app = useAppBridge();
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    console.log("shop", shop);

    useEffect(() => {
        if (!billing || billing.loading) return;

        if (!billing.isPaid) {
            const redirect = Redirect.create(app);

            redirect.dispatch(
                Redirect.Action.REMOTE,
                `https://admin.shopify.com/store/${shop}/charges/label-node/pricing_plans`
            );
        }
    }, [billing, app]);

    if (!billing || billing.loading) return null;

    if (!billing.isPaid) return null;

    return children;
};
