import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useAppBridge } from "./components/createContext/AppBridgeContext";
import { NavigationMenu } from "@shopify/app-bridge/actions";
import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";
import AddConsultant2 from "./pages/AddConsultant2";
import ConsultantCards from "./components/ConsultantCards/ConsultantCards";
import ViewProfile from "./components/ConsultantCards/ViewProfile";
import TabNavigation from "./components/ConsultantDashboard/TabNavigation";
import VideoCallingPage from "./components/ConsultantDashboard/VideoCallingPage";
import UserChat from "./components/ClientDashbord/UserChat";
import LoginForm from "./components/ConsultantDashboard/LoginForm";
import GlobalMessageNotification from "./components/AlertModel/GlobalMessageNotification";
import './components/ConsultantCards/ConsultantCards.css';
import { useSelector } from "react-redux";

// Component to handle iframe height sync on route changes
function IframeHeightSync() {
  const location = useLocation();

  useEffect(() => {
    const sendHeight = () => {
      try {
        const height = document.documentElement.scrollHeight;
        console.log("height____________________", height)
        if (window.parent) {
          window.parent.postMessage(
            { type: "AGORA_IFRAME_HEIGHT", height },
            "*"
          );
        }
      } catch (err) {
        console.error("Error sending height on route change:", err);
      }
    };
    // Delay to allow DOM to update after route change
    const timeoutId = setTimeout(sendHeight, 300);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
}

function App() {
  const app = useAppBridge();
  const [initialLoading, setInitialLoading] = useState(true);



 
  useEffect(() => {
    // Suppress React error overlay
    if (process.env.NODE_ENV === 'development') {
      const hideErrorOverlay = () => {
        const errorOverlay = document.getElementById('react-error-overlay');
        if (errorOverlay) {
          errorOverlay.style.display = 'none';
        }
        const iframe = document.querySelector('iframe[id*="webpack-dev-server"]');
        if (iframe) {
          iframe.style.display = 'none';
        }
        // Hide any error divs
        const errorDivs = document.querySelectorAll('div[style*="position: fixed"][style*="z-index"]');
        errorDivs.forEach(div => {
          if (div.textContent && div.textContent.includes('Uncaught runtime errors')) {
            div.style.display = 'none';
          }
        });
      };

      // Hide immediately
      hideErrorOverlay();

      // Use MutationObserver to continuously hide error overlay
      const observer = new MutationObserver(() => {
        hideErrorOverlay();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Also try to hide it via CSS
      const style = document.createElement('style');
      style.id = 'hide-error-overlay';
      style.textContent = `
        iframe[id*="webpack-dev-server"] { display: none !important; }
        #react-error-overlay { display: none !important; }
        div[style*="position: fixed"][style*="z-index"]:has-text("Uncaught runtime errors") { display: none !important; }
      `;
      document.head.appendChild(style);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Set initial loading to false after app initializes
  useEffect(() => {
    // Wait for DOM to be ready and ensure all providers are initialized
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Simple iframe height sync using postMessage
  useEffect(() => {
    const sendHeight = () => {
      try {
        const height = document.documentElement.scrollHeight;
        if (window.parent) {
          window.parent.postMessage(
            { type: "AGORA_IFRAME_HEIGHT", height },
            "*"
          );
        }
      } catch (err) {
        console.error("Error sending height:", err);
      }
    };

    // Send height on load and resize
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);
    setTimeout(sendHeight, 500);

    return () => {
      window.removeEventListener("load", sendHeight);
      window.removeEventListener("resize", sendHeight);
    };
  }, []);

  useEffect(() => {
    if (!app) return;

    try {
      const menu = NavigationMenu.create(app, {
        items: [
          { label: "Dashboard", destination: "/dashboard" },
          { label: "Consultants", destination: "/consultant-list" },
          { label: "Settings", destination: "/settings" }
        ]
      });
    } catch (error) {
      console.error("Error creating NavigationMenu:", error);
    }

  }, [app]);

  // Show loader during initial loading
  if (initialLoading) {
    return (
      <div className="page-loader">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p className="loader-text">Loading...</p>
        </div>
      </div>
    );
  }



  return (

    <BrowserRouter>
      {/* Iframe height sync on route changes */}
      <IframeHeightSync />
      {/* Global message notification - visible on all pages */}
      <GlobalMessageNotification />
      <Routes>
        <Route path="/" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
        <Route path="/dashboard" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
        <Route path="/consultant-list" element={<LayoutFrame><ConsultantList /></LayoutFrame>} />
        <Route path="/add-consultant" element={<LayoutFrame><AddConsultant /></LayoutFrame>} />
        <Route path="/add-consultant2" element={<LayoutFrame><AddConsultant2 /></LayoutFrame>} />
        <Route path="/pricing" element={<LayoutFrame><Pricing /></LayoutFrame>} />
        <Route path="/faq" element={<LayoutFrame><Faq /></LayoutFrame>} />
        <Route path="/consultant-cards" element={<ConsultantCards />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/consultant-dashboard" element={<TabNavigation />} />
        <Route path="/users-page/*" element={<TabNavigation />} />
        <Route path="/consulant-chats/*" element={<TabNavigation />} />
        <Route path="/video/calling/page" element={<VideoCallingPage />} />
        <Route path="/chats" element={<UserChat />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
