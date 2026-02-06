import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, redirect } from "react-router-dom";

import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
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
import VoucherSettings from "./pages/VoucherSettings";
import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
import { useAppBridge } from "./components/createContext/AppBridgeContext";
import { UseAppInstall } from "./components/ProtectRoute/UseAppInstall";
import ProtectAdminRoute from "./components/ProtectRoute/ProtectAdminRoute";
import UserTransHistory from "./pages/UserTransHistory";
import ManualDebetCreditBlance from "./pages/ManualDebetCreditBlance";
import NotFound from "./pages/NotFound";
import ProtectStoreFront from "./components/ProtectRoute/ProtectStoreFront";
import VoucherTable from "./pages/VoucherTable";
import { BillingProtectedRoute } from "./components/ProtectRoute/BillingProtectedRoute";
import { AppStatusProvider } from "./components/ProtectRoute/AppStatusProvider";
import AccountInformation from "./pages/AccountInformation";
import CallChatLogs from "./pages/CallChatLogs";
import ChatsPage from "./components/ConsultantDashboard/ChatsPage";
import DashboardPage from "./components/ConsultantDashboard/DashboardPage";
import CallLogsConsultant from "./components/ConsultantDashboard/CallChatLogsConsultant";
import ConsultantWalletLogs from "./components/ConsultantDashboard/ConsultantWalletLogs";
import WithdrawalRequestForm from "./components/ConsultantDashboard/WithdrawalRequestForm";




export default function App() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const adminId = params.get("AdminId");
  const app = useAppBridge();
  const { installed, accessDenied } = UseAppInstall(shop, app);

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

  const location = new URLSearchParams(window.location.search);
  const getPageHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  };

  const sendHeightToParent = () => {
    if (!window.parent) return;

    window.parent.postMessage(
      {
        type: "AGORA_IFRAME_HEIGHT",
        height: getPageHeight(),
      },
      "*"
    );
  };

  useEffect(() => {
    sendHeightToParent();

    const observer = new ResizeObserver(() => {
      sendHeightToParent();
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, [location]);


  // if (installed) {
  //   return <div>Redirecting to install URL...</div>;
  // }

  return (
    <Fragment>
      <BrowserRouter>
        <GlobalMessageNotification />
        <IncomingCallAlert />
        <Routes>
          <Route element={
            <ProtectAdminRoute installed={installed}>
              <BillingProtectedRoute>
                <LayoutFrame />
              </BillingProtectedRoute>
            </ProtectAdminRoute>
          }>
            <Route path="/not-found" element={<NotFound />} />
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultant-list" element={<ConsultantList />} />
            <Route path="/add-consultant" element={<AddConsultant />} />
            <Route path="/setting/history" element={<UserTransHistory />} />
            <Route path="/setting/wallet-management" element={<ManualDebetCreditBlance />} />
            <Route path="/account-information" element={<AccountInformation />} />
            <Route path="/admin-settings/voucher" element={<VoucherSettings />} />
            <Route path="/admin-settings/voucher-management" element={<VoucherTable />} />
            <Route path="/faq" element={<Faq />} />
          </Route>

          <Route path="/consultant-cards" element={
            <ProtectStoreFront>
              <ConsultantCards />
            </ProtectStoreFront>
          } />
          <Route path="/view-profile" element={
            <ProtectStoreFront>
              <ViewProfile />
            </ProtectStoreFront>
          } />
            <Route path="/consultant-dashboard/*" element={<TabNavigation />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="chats/:chatId?" element={<ChatsPage />} />
              <Route path="call-chat-logs" element={<CallLogsConsultant />} />
              <Route path="consultant-wallet-logs" element={<ConsultantWalletLogs />} />
              <Route path="withdrawal-request" element={<WithdrawalRequestForm />} />
            </Route>


          {/* <Route path="/consultant-dashboard/*" element={
            // <ProtectStoreFront>
              <TabNavigation />
            // </ProtectStoreFront>
          } />
          <Route path="/users-page/*" element={
            <ProtectStoreFront>
              <TabNavigation />
            </ProtectStoreFront>
          } />
          <Route path="/consulant-chats/*" element={
            <ProtectStoreFront>
              <TabNavigation />
            </ProtectStoreFront>
          } /> */}
          <Route path="/video/calling/page" element={
            // <ProtectStoreFront>
            <VideoCallingPage />
            // </ProtectStoreFront>
          } />
          <Route path="/chats" element={
            <ProtectStoreFront>
              <UserChat />
            </ProtectStoreFront>
          } />
          <Route path="/login" element={
            <ProtectStoreFront>
              <LoginForm />
            </ProtectStoreFront>
          } />
          <Route path="/fcm-token" element={
            // <ProtectStoreFront>
            <FcmTokenWindow />

          } />
          <Route path="/profile" element={
            <ProtectStoreFront>
              <ProfileSection />
            </ProtectStoreFront>
          }>
            <Route index element={
              <ProtectStoreFront>
                <Voucher />
              </ProtectStoreFront>
            } />
            <Route path="voucher" element={
              <ProtectStoreFront>
                <Voucher />
              </ProtectStoreFront>
            } />
            <Route path="history" element={
              <ProtectStoreFront>
                <History />
              </ProtectStoreFront>
            } />
            <Route path="call-chat-logs" element={
              <ProtectStoreFront>
                <CallChatLogs />
              </ProtectStoreFront>
            } />
          </Route>

        </Routes>
      </BrowserRouter>
    </Fragment >
  );
}




