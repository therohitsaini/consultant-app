import React, { useMemo, useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { AppBridgeContext } from "./AppBridgeContext";

function getHostFromWindow() {
  const urlParams = new URLSearchParams(window.location.search);
  let host = urlParams.get("host");
  if (!host && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    host = hashParams.get("host");
  }
  return host;
}

export default function AppBridgeProvider({ children }) {
  const host = getHostFromWindow();
  const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY;

  const app = useMemo(() => {
    if (!host || !apiKey) return null;
    try {
      return createApp({
        apiKey,
        host,
        forceRedirect: true,
      });
    } catch (err) {
      console.error("App Bridge init error:", err);
      return null;
    }
  }, [host, apiKey]);

  // Make app available globally for NavMenu and other App Bridge components
  useEffect(() => {
    if (app && typeof window !== 'undefined') {
      // NavMenu in @shopify/app-bridge-react v4+ can work with global app instance
      // This ensures compatibility with components that check window.shopify
      if (!window.shopify) {
        window.shopify = {};
      }
      window.shopify.app = app;
      console.log('✅ App Bridge app instance set globally for NavMenu');
    } else {
      console.warn('⚠️ App Bridge app instance is null - NavMenu may not work');
    }
  }, [app]);

  // If app is null we still render children (useful for local dev),
  // but NavMenu will not show in Shopify Admin unless app is valid/embedded.
  return (
    <AppBridgeContext.Provider value={app}>
      {children}
    </AppBridgeContext.Provider>
  );
}

