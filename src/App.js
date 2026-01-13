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
import AdminSettings from "./pages/AdminSettings";
import VaocherSettings from "./pages/VaocherSettings";
import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
import AdminProtectRoute from "./components/ProtectRoute/AdminProtectRoute";
import { NavigationMenu } from "@shopify/app-bridge-react";
import AdminMenu, { MyApp } from "./pages/AdminMenu";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "./components/createContext/AppBridgeContext";




export default function App() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  console.log("shop", shop);
  const app = useAppBridge();
  // const checkInstalled = async () => {
  //   if (!app || !shop) {
  //     return console.warn("App Bridge not initialized or shop missing");
  //   }
  //   const url = `https://test-online-consultation.zend-apps.com/app/app/is-installed/${shop}`;
  //   const response = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log("data++++++++++++++================", data);
  //   if (data?.installed === false) {
  //     const redirect = redirect.create(app);
  //     redirect.dispatch(
  //       Redirect.Action.REMOTE,
  //       `https://test-online-consultation.zend-apps.com/app/install?shop=${shop}`
  //     );
  //   }
  // }
  // useEffect(() => {
  //   checkInstalled();
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


  return (
    <Fragment>


      <BrowserRouter>

        <GlobalMessageNotification />
        <IncomingCallAlert />

        <Routes>
          <Route element={
            <LayoutFrame />

          }>
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



// import React, { Fragment, useEffect, useState } from "react";

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { MemoryRouter } from "react-router-dom";

// import { Redirect } from "@shopify/app-bridge/actions";
// import { useAppBridge } from "./components/createContext/AppBridgeContext";

// import LayoutFrame from "./pages/LayoutFrame";
// import Dashboard from "./pages/Dashboard";
// import ConsultantList from "./pages/ConsultantList";
// import AddConsultant from "./pages/AddConsultant";
// import Pricing from "./pages/Pricing";
// import Faq from "./pages/Faq";

// export default function App() {
//   const [checking, setChecking] = useState(true);
//   const params = new URLSearchParams(window.location.search);
//   const shop = params.get("shop");
//   const host = params.get("host");

//   const app = useAppBridge();
//   // useEffect(() => {
//   //   if (!app || !shop) return;

//   //   const checkInstalled = async () => {
//   //     try {
//   //       const res = await fetch(
//   //         `https://test-online-consultation.zend-apps.com/app/app/is-installed/${shop}`
//   //       );
//   //       const data = await res.json();
//   //       console.log("data", data.installed);

//   //       if (data.installed === false) {
//   //         console.log("App not installed, redirecting to install route...");
//   //         // Redirect user to backend install route
//   //         window.location.href = `https://test-online-consultation.zend-apps.com/app/install?shop=${shop}`;
//   //         return;
//   //       }

//   //       // App is installed, continue loading React app
//   //       setChecking(false);
//   //     } catch (err) {
//   //       console.error("Error checking installation:", err);
//   //     }
//   //   };

//   //   checkInstalled();
//   // }, [shop, app]);

//   // // Show loading until installation check is complete
//   // if (checking) {
//   //   return <div>Checking app installation...</div>;
//   // }

//   // return <div>Loading...</div>; // Show loading while checking

//   // if (!app) return null;

//   return (
//     <>
//       {/* Navigation menu is rendered in index.js via AdminMenu component */}
//       {/* ❌ BrowserRouter hatao */}
//       <BrowserRouter>
//         <Routes>
//           <Route element={<LayoutFrame />}>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/consultant-list" element={<ConsultantList />} />
//             <Route path="/add-consultant" element={<AddConsultant />} />
//             <Route path="/pricing" element={<Pricing />} />
//             <Route path="/faq" element={<Faq />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }
