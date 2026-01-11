import { createContext, useContext, useMemo } from "react";
import createApp from "@shopify/app-bridge";

export const AppBridgeContext = createContext(null);
export const useAppBridge = () => useContext(AppBridgeContext);

export const AppBridgeProvider = ({ children }) => {
    const getHost = () => {
        const params = new URLSearchParams(window.location.search);
        let host = params.get("host");

        if (!host && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            host = hashParams.get("host");
        }

        return host;
    };

    const host = getHost();
    const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;

    const app = useMemo(() => {
        if (!host || !apiKey) {
            return console.warn("App Bridge: Missing host or API key.");
        }

        return createApp({
            apiKey,
            host,
            forceRedirect: true,
        });
    }, [host, apiKey]);

    if (!app) return <div>Loading Shopify App...</div>;

    return (
        <AppBridgeContext.Provider value={app}>
            {children}
        </AppBridgeContext.Provider>
    );
};
