import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import UsersPage from "./components/ConsultantDashboard/UsersPage";
import ChatsPage from "./components/ConsultantDashboard/ChatsPage";
import VideoCallingPage from "./components/ConsultantDashboard/VideoCallingPage";
import UserChat from "./components/ClientDashbord/UserChat";
import LoginForm from "./components/ConsultantDashboard/LoginForm";
import GlobalMessageNotification from "./components/AlertModel/GlobalMessageNotification";

function App() {
  const app = useAppBridge();

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

  return (
    
    <BrowserRouter>
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
        <Route path="/view-profile/:shop_id/:consultant_id" element={<ViewProfile />} />
        <Route path="/consultant-theme-page" element={<TabNavigation />} />
        <Route path="/users-page/*" element={<TabNavigation />} />
        <Route path="/chats/*" element={<TabNavigation />} />
        <Route path="/video/calling/page" element={<VideoCallingPage />} />
        <Route path="/user-chat/:consultantId" element={<UserChat />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
