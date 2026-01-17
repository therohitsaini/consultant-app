import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, redirect } from "react-router-dom";

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
import VaocherSettings from "./pages/VaocherSettings";
import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "./components/createContext/AppBridgeContext";
import { UseAppInstall } from "./components/ProtectRoute/UseAppInstall";
import ProtectAdminRoute from "./components/ProtectRoute/ProtectAdminRoute";
import UserTransHistory from "./pages/UserTransHistory";
import WalletHistroy from "./pages/WalletHistroy";
import ManualDebetCreditBlance from "./pages/ManualDebetCreditBlance";




export default function App() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const adminId = params.get("AdminId");
  console.log("shop", shop, "adminId", adminId);
  // const [installed, setInstalled] = useState(false);
  const app = useAppBridge();
  const {installed,accessDenied} = UseAppInstall(shop, app);


  // const app = useAppBridge();

  // const getInstallUrl = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://test-online-consultation.zend-apps.com/app/install/${shop}`
  //     );

  //     const data = await response.json();
  //     console.log("data", data);

  //     if (!data.installed && data.installUrl) {
  //       console.log("Redirecting to install URL via App Bridge...");
  //       setInstalled(true);
  //       const redirect = Redirect.create(app);
  //       redirect.dispatch(Redirect.Action.REMOTE, data.installUrl);
  //       return;
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // useEffect(() => {
  //   if (shop) {
  //     getInstallUrl();
  //   }
  // }, [shop]);



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
  console.log("location", location);
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
              <LayoutFrame />
            </ProtectAdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="consultant-list" element={<ConsultantList />} />
            <Route path="add-consultant" element={<AddConsultant />} />
            <Route path="/setting/history" element={<UserTransHistory />} />
            <Route path="/setting/wallet-history" element={<WalletHistroy />} />
            <Route path="/setting/wallet-management" element={<ManualDebetCreditBlance />} />
            <Route path="pricing" element={<Pricing />} />
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




