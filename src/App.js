import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppBridgeProvider } from "./components/createContext/AppBridgeContext";
import AppNavigation from "./components/AppNavigation";
import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";
import AddConsultant2 from "./pages/AddConsultant2";

function App() {
  // Extract host from URL parameters (Shopify provides this)
  const queryParams = new URLSearchParams(window.location.search);
  const host = queryParams.get('host');

  // If host is not present, app might not be loaded in Shopify admin
  // if (!host) {
  //   return (
  //     <div style={{ padding: '20px', textAlign: 'center' }}>
  //       <h1>App must be loaded from Shopify Admin</h1>
  //       <p>This app needs to be accessed through the Shopify admin panel.</p>
  //     </div>
  //   );
  // }

  return (
    <AppBridgeProvider>
      <BrowserRouter>
        {/* Navigation will appear in Shopify admin sidebar */}
        <AppNavigation />
        
        {/* Your app routes */}
        <Routes>
            <Route path="/" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
            <Route path="/dashboard" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
            <Route path="/consultant-list" element={<LayoutFrame><ConsultantList /></LayoutFrame>} />
            <Route path="/add-consultant" element={<LayoutFrame><AddConsultant /></LayoutFrame>} />
            <Route path="/add-consultant2" element={<LayoutFrame><AddConsultant2 /></LayoutFrame>} />
            <Route path="/pricing" element={<LayoutFrame><Pricing /></LayoutFrame>} />
            <Route path="/faq" element={<LayoutFrame><Faq /></LayoutFrame>} />
        </Routes>
      </BrowserRouter>
    </AppBridgeProvider>
  );
}

export default App;
