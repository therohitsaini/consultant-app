import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";

import ConsultantCards from "./components/ConsultantCards/ConsultantCards";
import ViewProfile from "./components/ConsultantCards/ViewProfile";
import TabNavigation from "./components/ConsultantDashboard/TabNavigation";
import VideoCallingPage from "./components/ConsultantDashboard/VideoCallingPage";
import UserChat from "./components/ClientDashbord/UserChat";
import LoginForm from "./components/ConsultantDashboard/LoginForm";
import GlobalMessageNotification from "./components/AlertModel/GlobalMessageNotification";
import ProfileSection from "./components/ClientDashbord/ProfileSection";
import Voucher from "./pages/Voucher";
import History from "./pages/History";
import AdminSettings from "./pages/AdminSettings";
import VaocherSettings from "./pages/VaocherSettings";
import AdminMenu from "./pages/AdminMenu";
import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";

/* 🔥 Shopify iframe height sync */
function IframeHeightSync() {
  const location = useLocation();

  useEffect(() => {
    const sendHeight = () => {
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "AGORA_IFRAME_HEIGHT",
            height: document.documentElement.scrollHeight,
          },
          "*"
        );
      }
    };

    setTimeout(sendHeight, 300);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <Fragment>
      {/* <AdminMenu /> */}
      <BrowserRouter>
        <IframeHeightSync />
        <GlobalMessageNotification />
        <Routes>
          {/* ✅ LAYOUT ROUTE (SIDEBAR + TOPBAR) */}
          <Route element={<LayoutFrame />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="consultant-list" element={<ConsultantList />} />
            <Route path="add-consultant" element={<AddConsultant />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="admin-settings" element={<AdminSettings />} />
            <Route path="admin-settings/voucher" element={<VaocherSettings />} />
            <Route path="faq" element={<Faq />} />
          </Route>

          {/* ❌ FULL SCREEN ROUTES (NO LAYOUT) */}
          <Route path="/consultant-cards" element={<ConsultantCards />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/consultant-dashboard/*" element={<TabNavigation />} />
          <Route path="/users-page/*" element={<TabNavigation />} />
          <Route path="/consulant-chats/*" element={<TabNavigation />} />
          <Route path="/video/calling/page" element={<VideoCallingPage />} />
          <Route path="/chats" element={<UserChat />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/fcm-token" element={<FcmTokenWindow />} />
          <Route path="/profile" element={<ProfileSection />}>
            <Route index element={<Voucher />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment >
  );
}
