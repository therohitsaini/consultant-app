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
import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
import AdminProtectRoute from "./components/ProtectRoute/AdminProtectRoute";

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



  useEffect(() => {
    const handleMessage = (event) => {

      if (!event.data || !event.data.type) return;

      if (event.data.type !== "SHOW_TOAST") return;

      console.log("REAL MESSAGE FROM IFRAME:", event.data);

      // Backend ko bhejna
      fetch("http://YOUR_BACKEND_DOMAIN:3000/logMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event.data),
      }).catch(console.error);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);


  return (
    <Fragment>
      <BrowserRouter>
        <IframeHeightSync />
        <GlobalMessageNotification />
        <IncomingCallAlert />
        <Routes>
          <Route element={<AdminProtectRoute><LayoutFrame /></AdminProtectRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="consultant-list" element={<ConsultantList />} />
            <Route path="add-consultant" element={<AddConsultant />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="admin-settings" element={<AdminSettings />} />
            <Route path="admin-settings/voucher" element={<VaocherSettings />} />
            <Route path="faq" element={<Faq />} />
          </Route>
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
