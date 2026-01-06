// import React, { Fragment, useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// import LayoutFrame from "./pages/LayoutFrame";
// import Dashboard from "./pages/Dashboard";
// import ConsultantList from "./pages/ConsultantList";
// import AddConsultant from "./pages/AddConsultant";
// import Pricing from "./pages/Pricing";
// import Faq from "./pages/Faq";
// import ConsultantCards from "./components/ConsultantCards/ConsultantCards";
// import ViewProfile from "./components/ConsultantCards/ViewProfile";
// import TabNavigation from "./components/ConsultantDashboard/TabNavigation";
// import VideoCallingPage from "./components/ConsultantDashboard/VideoCallingPage";
// import UserChat from "./components/ClientDashbord/UserChat";
// import LoginForm from "./components/ConsultantDashboard/LoginForm";
// import GlobalMessageNotification from "./components/AlertModel/GlobalMessageNotification";
// import ProfileSection from "./components/ClientDashbord/ProfileSection";
// import Voucher from "./pages/Voucher";
// import History from "./pages/History";
// import AdminSettings from "./pages/AdminSettings";
// import VaocherSettings from "./pages/VaocherSettings";
// import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
// import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
// import AdminProtectRoute from "./components/ProtectRoute/AdminProtectRoute";
// import { NavigationMenu, NavMenu, useAppBridge } from "@shopify/app-bridge-react";

// function IframeHeightSync() {
//   const location = useLocation();
//   const { params, isShopifyAdmin } = useAppBridge();
//   console.log("params", params, "isShopifyAdmin", isShopifyAdmin)
//   const getNavLinks = () => {
//     if (!params?.shop || !params?.host) return [];

//     const baseParams = `shop=${params.shop}&host=${params.host}&embedded=1`;

//     return [
//       {
//         label: "Dashboard",
//         destination: `/?${baseParams}#/dashboard`,
//       },
//       {
//         label: "Consultants",
//         destination: `/?${baseParams}#/consultant-list`,
//       },
//       {
//         label: "Pricing",
//         destination: `/?${baseParams}#/pricing`,
//       },
//       {
//         label: "Admin Settings",
//         destination: `/?${baseParams}#/admin-settings`,
//       },
//       {
//         label: "FAQ",
//         destination: `/?${baseParams}#/faq`,
//       },
//     ];
//   };

//   useEffect(() => {
//     const sendHeight = () => {
//       if (window.parent) {
//         window.parent.postMessage(
//           {
//             type: "AGORA_IFRAME_HEIGHT",
//             height: document.documentElement.scrollHeight,
//           },
//           "*"
//         );
//       }
//     };

//     setTimeout(sendHeight, 300);
//   }, [location.pathname]);

//   return null;
// }


// export default function App() {



//   useEffect(() => {
//     const handleMessage = (event) => {

//       if (!event.data || !event.data.type) return;

//       if (event.data.type !== "SHOW_TOAST") return;

//       console.log("REAL MESSAGE FROM IFRAME:", event.data);

//       // Backend ko bhejna
//       fetch("http://YOUR_BACKEND_DOMAIN:3000/logMessage", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(event.data),
//       }).catch(console.error);
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);


//   return (
//     <Fragment>
//       {isShopifyAdmin && params && (
//         <NavigationMenu
//           navigationLinks={getNavLinks()}
//         />
//       )}

//       <BrowserRouter>
//         <IframeHeightSync />
//         <GlobalMessageNotification />
//         <IncomingCallAlert />

//         <Routes>
//           <Route element={<AdminProtectRoute><LayoutFrame /></AdminProtectRoute>}>
//             <Route index element={<Dashboard />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="consultant-list" element={<ConsultantList />} />
//             <Route path="add-consultant" element={<AddConsultant />} />
//             <Route path="pricing" element={<Pricing />} />
//             <Route path="admin-settings" element={<AdminSettings />} />
//             <Route path="admin-settings/voucher" element={<VaocherSettings />} />
//             <Route path="faq" element={<Faq />} />
//           </Route>
//           <Route path="/consultant-cards" element={<ConsultantCards />} />
//           <Route path="/view-profile" element={<ViewProfile />} />
//           <Route path="/consultant-dashboard/*" element={<TabNavigation />} />
//           <Route path="/users-page/*" element={<TabNavigation />} />
//           <Route path="/consulant-chats/*" element={<TabNavigation />} />
//           <Route path="/video/calling/page" element={<VideoCallingPage />} />
//           <Route path="/chats" element={<UserChat />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/fcm-token" element={<FcmTokenWindow />} />
//           <Route path="/profile" element={<ProfileSection />}>
//             <Route index element={<Voucher />} />
//             <Route path="voucher" element={<Voucher />} />
//             <Route path="history" element={<History />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </Fragment >
//   );
// }
import React, { Fragment, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import { useAppBridge } from "./components/createContext/AppBridgeContext"; // Your custom hook

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

// IframeHeightSync component - SIMPLIFIED
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

// Main App Component
export default function App() {
  const { params, isShopifyAdmin } = useAppBridge();
  console.log("🔍 App Debug:", { params, isShopifyAdmin });

  // ✅ NavLinks function - CORRECT PLACEMENT
  const navLinks = useMemo(() => {
    if (!params?.shop || !params?.host) {
      console.log("❌ Cannot create nav links: missing params");
      return [];
    }

    const baseParams = `shop=${params.shop}&host=${params.host}&embedded=1`;
    const adminIdParam = params.adminId ? `&adminId=${params.adminId}` : '';

    const links = [
      {
        label: "Dashboard",
        destination: `/?${baseParams}${adminIdParam}#/dashboard`,
      },
      {
        label: "Consultants",
        destination: `/?${baseParams}${adminIdParam}#/consultant-list`,
      },
      {
        label: "Pricing",
        destination: `/?${baseParams}${adminIdParam}#/pricing`,
      },
      {
        label: "Admin Settings",
        destination: `/?${baseParams}${adminIdParam}#/admin-settings`,
      },
      {
        label: "FAQ",
        destination: `/?${baseParams}${adminIdParam}#/faq`,
      },
    ];

    console.log("✅ Nav links created:", links);
    return links;
  }, [params]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || !event.data.type) return;
      if (event.data.type !== "SHOW_TOAST") return;

      console.log("REAL MESSAGE FROM IFRAME:", event.data);

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
      {/* ✅ Shopify NavMenu - Only show when in Shopify Admin */}
      {isShopifyAdmin && params && navLinks.length > 0 && (
        <NavMenu
          navigationLinks={navLinks}
        />
      )}

      <BrowserRouter>
        <IframeHeightSync />
        <GlobalMessageNotification />
        <IncomingCallAlert />

        <Routes>
          {/* ✅ Shopify Admin Protected Routes */}
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

          {/* ✅ Other Routes (also protected by AdminProtectRoute internally) */}
          <Route path="/consultant-cards" element={
            <AdminProtectRoute>
              <ConsultantCards />
            </AdminProtectRoute>
          } />
          <Route path="/view-profile" element={
            <AdminProtectRoute>
              <ViewProfile />
            </AdminProtectRoute>
          } />
          <Route path="/consultant-dashboard/*" element={
            <AdminProtectRoute>
              <TabNavigation />
            </AdminProtectRoute>
          } />
          <Route path="/users-page/*" element={
            <AdminProtectRoute>
              <TabNavigation />
            </AdminProtectRoute>
          } />
          <Route path="/consulant-chats/*" element={
            <AdminProtectRoute>
              <TabNavigation />
            </AdminProtectRoute>
          } />
          <Route path="/video/calling/page" element={
            <AdminProtectRoute>
              <VideoCallingPage />
            </AdminProtectRoute>
          } />
          <Route path="/chats" element={
            <AdminProtectRoute>
              <UserChat />
            </AdminProtectRoute>
          } />

          {/* ✅ Public Routes (No protection needed) */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/fcm-token" element={<FcmTokenWindow />} />

          <Route path="/profile" element={
            <AdminProtectRoute>
              <ProfileSection />
            </AdminProtectRoute>
          }>
            <Route index element={<Voucher />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}