// import { createContext, useContext, useMemo, useEffect } from "react";
// import createApp from "@shopify/app-bridge";

// export const AppBridgeContext = createContext(null);

// export const useAppBridge = () => {
//   const app = useContext(AppBridgeContext);
//   return app;
// };

// export const AppBridgeProvider = ({ children }) => {
//   const getHost = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     let host = urlParams.get("host");
//     const shop = urlParams.get("shop");
//     const embedded = urlParams.get("embedded");
//     if (!shop || !host || embedded !== "1") {
//       return null;
//     }

//     if (!host && window.location.hash) {
//       const hashParams = new URLSearchParams(window.location.hash.substring(1));
//       host = hashParams.get("host");
//     }
//     return host;
//   };

//   const host = getHost();
//   const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;
//   console.log("apiKey", apiKey)

//   const app = useMemo(() => {
//     if (!host) {
//       console.warn("App Bridge: Host parameter not found. App should be accessed through Shopify admin.");
//       return null;
//     }

//     if (!apiKey) {
//       console.error("App Bridge: REACT_APP_SHOPIFY_API_KEY is not set in environment variables.");
//       return null;
//     }

//     try {
//       const appInstance = createApp({
//         apiKey: apiKey,
//         host: host,
//         forceRedirect: true,
//         embedded: true,
//       });
//       console.log("✅ App Bridge initialized successfully with host:", host);
//       return appInstance;
//     } catch (error) {
//       console.error("❌ Error initializing App Bridge:", error);
//       return null;
//     }
//   }, [host, apiKey]);

//   useEffect(() => {
//     if (host && apiKey) {
//       console.log("App Bridge Debug:", {
//         host: host,
//         apiKey: "SET",
//         appInitialized: app !== null,
//       });
//     } else {
//       console.warn("App Bridge Debug:", {
//         host: host || "NOT FOUND",
//         apiKey: apiKey ? "SET" : "NOT SET",
//         message: "App Bridge will not work without host and API key",
//       });
//     }
//   }, [host, apiKey, app]);

//   return (
//     <AppBridgeContext.Provider value={app}>
//       {children}
//     </AppBridgeContext.Provider>
//   );
// };
// AppBridgeContext.js - UPDATED VERSION
import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import createApp from "@shopify/app-bridge";

export const AppBridgeContext = createContext(null);

export const useAppBridge = () => {
  const context = useContext(AppBridgeContext);
  return context;
};

// ✅ Function to get AND persist Shopify params
const getShopifyParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // 1. Try to get from URL parameters (first load)
  let shop = urlParams.get("shop");
  let host = urlParams.get("host");
  let embedded = urlParams.get("embedded");
  const adminId = urlParams.get("adminId") || localStorage.getItem("doamin_V_id");

  // 2. If not in URL, check localStorage (page navigation)
  if (!shop || !host) {
    shop = localStorage.getItem("shopify_shop");
    host = localStorage.getItem("shopify_host");
    embedded = localStorage.getItem("shopify_embedded");
  }

  // 3. Also check hash for embedded apps
  if (!host && window.location.hash) {
    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashHost = hashParams.get("host");
      const hashShop = hashParams.get("shop");
      if (hashHost) host = hashHost;
      if (hashShop) shop = hashShop;
    } catch (e) {
      console.log("Hash parse error:", e);
    }
  }

  // 4. Validate and save for future
  if (shop && host) {
    localStorage.setItem("shopify_shop", shop);
    localStorage.setItem("shopify_host", host);
    localStorage.setItem("shopify_embedded", embedded || "1");
    if (adminId) localStorage.setItem("shopify_adminId", adminId);
  }

  return {
    shop: shop,
    host: host,
    embedded: embedded || "1",
    adminId: adminId,
    isValid: !!(shop && host && (embedded === "1" || embedded === "0"))
  };
};

export const AppBridgeProvider = ({ children }) => {
  const [params, setParams] = useState(null);
  const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;

  // ✅ Initial load: Get params once
  useEffect(() => {
    const shopifyParams = getShopifyParams();
    setParams(shopifyParams);
    console.log("📦 Shopify Params loaded:", shopifyParams);
  }, []);

  // ✅ Create App Bridge instance
  const app = useMemo(() => {
    if (!params?.host || !apiKey) {
      console.warn("App Bridge: Missing host or API key", { host: params?.host, apiKey: !!apiKey });
      return null;
    }

    try {
      const appInstance = createApp({
        apiKey: apiKey,
        host: params.host,
        forceRedirect: true,
        embedded: true,
      });
      console.log("✅ App Bridge initialized with host:", params.host);
      return appInstance;
    } catch (error) {
      console.error("❌ App Bridge initialization error:", error);
      return null;
    }
  }, [params?.host, apiKey]);

  // ✅ Context value contains both app AND params
  const contextValue = useMemo(() => ({
    app: app,
    params: params,
    isShopifyAdmin: !!(params?.host && params?.shop)
  }), [app, params]);

  return (
    <AppBridgeContext.Provider value={contextValue}>
      {children}
    </AppBridgeContext.Provider>
  );
};
