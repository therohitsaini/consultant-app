import { createContext, useContext, useMemo, useEffect } from "react";
import createApp from "@shopify/app-bridge";

export const AppBridgeContext = createContext(null);

export const useAppBridge = () => {
  const app = useContext(AppBridgeContext);
  return app;
};

export const AppBridgeProvider = ({ children }) => {
  const getHost = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let host = urlParams.get("host");
    const shop = urlParams.get("shop");
    const embedded = urlParams.get("embedded");
    if (!shop || !host || embedded !== "1") {
      return null;
    }

    if (!host && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      host = hashParams.get("host");
    }
    return host;
  };

  const host = getHost();
  const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;
  console.log("apiKey", apiKey)

  const app = useMemo(() => {
    if (!host) {
      console.warn("App Bridge: Host parameter not found. App should be accessed through Shopify admin.");
      return null;
    }

    if (!apiKey) {
      console.error("App Bridge: REACT_APP_SHOPIFY_API_KEY is not set in environment variables.");
      return null;
    }

    try {
      const appInstance = createApp({
        apiKey: apiKey,
        host: host,
        forceRedirect: true,
        embedded: true,
      });
      console.log("✅ App Bridge initialized successfully with host:", host);
      return appInstance;
    } catch (error) {
      console.error("❌ Error initializing App Bridge:", error);
      return null;
    }
  }, [host, apiKey]);

  useEffect(() => {
    if (host && apiKey) {
      console.log("App Bridge Debug:", {
        host: host,
        apiKey: "SET",
        appInitialized: app !== null,
      });
    } else {
      console.warn("App Bridge Debug:", {
        host: host || "NOT FOUND",
        apiKey: apiKey ? "SET" : "NOT SET",
        message: "App Bridge will not work without host and API key",
      });
    }
  }, [host, apiKey, app]);

  return (
    <AppBridgeContext.Provider value={app}>
      {children}
    </AppBridgeContext.Provider>
  );
};

