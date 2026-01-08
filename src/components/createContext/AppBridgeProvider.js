// import React, { createContext, useContext, useMemo, useEffect } from "react";
// import createApp from "@shopify/app-bridge";

// export const AppBridgeContext = createContext(null);

// export const useAppBridge = () => useContext(AppBridgeContext);

// const getShopifyParams = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const shop = urlParams.get("shop");
//   const host = urlParams.get("host");
//   const embedded = urlParams.get("embedded");
//   return { shop, host, embedded };
// };

// export const AppBridgeProvider = ({ children }) => {
//   const { shop, host, embedded } = getShopifyParams();
//   const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;

//   // Validation: only create AppBridge if all params valid
//   const app = useMemo(() => {
//     if (!shop || !host || embedded !== "1" || !apiKey) return null;
//     try {
//       return createApp({
//         apiKey,
//         host,
//         forceRedirect: true,
//         embedded: true,
//       });
//     } catch (err) {
//       console.error("App Bridge init error:", err);
//       return null;
//     }
//   }, [shop, host, embedded, apiKey]);

//   useEffect(() => {
//     if (app && typeof window !== "undefined") {
//       if (!window.shopify) window.shopify = {};
//       window.shopify.app = app;
//     }
//   }, [app]);

//   return (
//     <AppBridgeContext.Provider value={app}>
//       {children}
//     </AppBridgeContext.Provider>
//   );
// };
