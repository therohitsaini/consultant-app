// hooks/useAppInstall.js
import { useState, useEffect } from "react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Navigate } from "react-router-dom";
import { getAppBridgeToken } from "../../utils/getAppBridgeToken";

export const UseAppInstall = (shop, app) => {
    const [installed, setInstalled] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {

        const checkInstall = async () => {
            if (!shop.endsWith(".myshopify.com")) {
                <Navigate to="/not-found" />
                return;
            }
            const token = await getAppBridgeToken(app);
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_HOST}/app/install/${shop}`
                    , {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                const data = await response.json();
                if (!data.installed && data.installUrl) {
                    const redirect = Redirect.create(app);
                    redirect.dispatch(Redirect.Action.REMOTE, data.installUrl);
                    return;
                }
                if (data.installed) {
                    localStorage.setItem("domain_V_id", data.adminId);
                    setInstalled(true);
                }
            } catch (error) {
                setAccessDenied(true);
                console.log("error", error);
            }
        };
        if (shop) checkInstall();
    }, [shop, app]);

    return { installed, accessDenied };
};
