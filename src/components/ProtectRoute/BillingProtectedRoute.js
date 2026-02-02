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
    const match = shop?.match(/^([a-z0-9-]+)\.myshopify\.com$/);
    const store = match ? match[1] : null;
    console.log("store", store);
    useEffect(() => {
        if (!billing || billing.loading) return;
        if (!billing.isPaid) {
            const redirect = Redirect.create(app);

            redirect.dispatch(
                Redirect.Action.REMOTE,
                `https://admin.shopify.com/store/${store}/charges/label-node/pricing_plans`
            );
        }
    }, [billing, app]);

    if (!billing || billing.loading) return null;

    if (!billing.isPaid) return null;

    return children;
};
