// hooks/useAppInstall.js
import { useState, useEffect } from "react";
import { Redirect } from "@shopify/app-bridge/actions";

export const UseAppInstall = (shop, app) => {
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        const checkInstall = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_HOST}/app/install/${shop}`
                );
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
                console.log("error", error);
            }
        };

        if (shop) checkInstall();
    }, [shop, app]);

    return installed;
};
