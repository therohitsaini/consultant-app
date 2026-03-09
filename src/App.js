// import React, { Fragment, useEffect, useState } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   useLocation,
//   redirect,
// } from "react-router-dom";

// import LayoutFrame from "./pages/LayoutFrame";
// import Dashboard from "./pages/Dashboard";
// import ConsultantList from "./pages/ConsultantList";
// import AddConsultant from "./pages/AddConsultant";
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
// import VoucherSettings from "./pages/VoucherSettings";
// import FcmTokenWindow from "./firebase/utils/FcmTokenWindow";
// import IncomingCallAlert from "./components/AlertModel/IncommingCallAlert";
// import { useAppBridge } from "./components/createContext/AppBridgeContext";
// import { UseAppInstall } from "./components/ProtectRoute/UseAppInstall";
// import ProtectAdminRoute from "./components/ProtectRoute/ProtectAdminRoute";
// import UserTransHistory from "./pages/UserTransHistory";
// import ManualDebetCreditBlance from "./pages/ManualDebetCreditBlance";
// import NotFound from "./pages/NotFound";
// import ProtectStoreFront from "./components/ProtectRoute/ProtectStoreFront";
// import VoucherTable from "./pages/VoucherTable";
// import { BillingProtectedRoute } from "./components/ProtectRoute/BillingProtectedRoute";
// import { AppStatusProvider } from "./components/ProtectRoute/AppStatusProvider";
// import AccountInformation from "./pages/AccountInformation";
// import CallChatLogs from "./pages/CallChatLogs";
// import ChatsPage from "./components/ConsultantDashboard/ChatsPage";
// import DashboardPage from "./components/ConsultantDashboard/DashboardPage";
// import CallLogsConsultant from "./components/ConsultantDashboard/CallChatLogsConsultant";
// import ConsultantWalletLogs from "./components/ConsultantDashboard/ConsultantWalletLogs";
// import WithdrawalRequestForm from "./components/ConsultantDashboard/WithdrawalRequestForm";
// import WithdrawalRequest from "./pages/WithdrawalRequest";
// import "./App.css";
// import WithdrawalRequestTable from "./components/ConsultantDashboard/WithdrawalRequestTable";
// import AdminPercentage from "./pages/AdminPercentage";
// import RevenuManagement from "./pages/RevenuManagement";
// import { useDispatch } from "react-redux";
// import { verifyToken } from "./components/Redux/slices/authConsultantSlice";
// import ConsultantProtectedRoute from "./components/ProtectRoute/ConsultantProtectedRoute";
// import PushCallIncoming from "./components/AlertModel/PushCallIncoming";

// export default function App() {
//   const params = new URLSearchParams(window.location.search);
//   const shop = params.get("shop");
//   const adminId = params.get("AdminId");
//   const app = useAppBridge();
//   const { installed, accessDenied } = UseAppInstall(shop, app);

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

//   const location = new URLSearchParams(window.location.search);
//   const getPageHeight = () => {
//     return Math.max(
//       document.body.scrollHeight,
//       document.documentElement.scrollHeight,
//       document.body.offsetHeight,
//       document.documentElement.offsetHeight,
//       document.body.clientHeight,
//       document.documentElement.clientHeight,
//     );
//   };

//   const sendHeightToParent = () => {
//     if (!window.parent) return;

//     window.parent.postMessage(
//       {
//         type: "AGORA_IFRAME_HEIGHT",
//         height: getPageHeight(),
//       },
//       "*",
//     );
//   };

//   useEffect(() => {
//     sendHeightToParent();

//     const observer = new ResizeObserver(() => {
//       sendHeightToParent();
//     });

//     observer.observe(document.body);

//     return () => observer.disconnect();
//   }, [location]);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(verifyToken());
//   }, [dispatch]);

//   return (
//     <Fragment>
//       <BrowserRouter>
//         <GlobalMessageNotification />
//         <IncomingCallAlert />
//         <Routes>
//           <Route
//             element={
//               <ProtectAdminRoute installed={installed}>
//                 <BillingProtectedRoute>
//                   <LayoutFrame />
//                 </BillingProtectedRoute>
//               </ProtectAdminRoute>
//             }
//           >
//             <Route path="/not-found" element={<NotFound />} />
//             <Route index element={<Dashboard />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/consultant-list" element={<ConsultantList />} />
//             <Route
//               path="/consultant-list/add-consultant"
//               element={<AddConsultant />}
//             />
//             <Route path="/history" element={<UserTransHistory />} />
//             <Route
//               path="/wallet-management"
//               element={<ManualDebetCreditBlance />}
//             />
//             <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
//             <Route
//               path="/account-information"
//               element={<AccountInformation />}
//             />
//             <Route
//               path="/voucher-management/voucher"
//               element={<VoucherSettings />}
//             />
//             <Route path="/voucher-management" element={<VoucherTable />} />
//             <Route path="/admin-percentage" element={<AdminPercentage />} />
//             <Route path="/revenue-management" element={<RevenuManagement />} />
//             <Route path="/faq" element={<Faq />} />
//           </Route>
//           <Route
//             path="/consultant-cards"
//             element={
//               <ProtectStoreFront>
//                 <ConsultantCards />
//               </ProtectStoreFront>
//             }
//           />
//           <Route
//             path="/view-profile"
//             element={
//               <ProtectStoreFront>
//                 <ViewProfile />
//               </ProtectStoreFront>
//             }
//           />
//           <Route path="/push-call-incoming" element={<PushCallIncoming />} />

//           <Route
//             path="/consultant-dashboard/*"
//             element={
//               <ConsultantProtectedRoute>
//                 <TabNavigation />
//               </ConsultantProtectedRoute>
//             }
//           >
//             <Route index element={<DashboardPage />} />
//             <Route path="dashboard" element={<DashboardPage />} />
//             <Route path="chats/:chatId?" element={<ChatsPage />} />
//             <Route path="call-chat-logs" element={<CallLogsConsultant />} />
//             <Route
//               path="consultant-wallet-logs"
//               element={<ConsultantWalletLogs />}
//             />
//             <Route
//               path="withdrawal-request"
//               element={<WithdrawalRequestForm />}
//             />
//             <Route
//               path="withdrawal-request-table"
//               element={<WithdrawalRequestTable />}
//             />
//           </Route>

//           <Route
//             path="/video/calling/page"
//             element={
//               // <ProtectStoreFront>
//               <VideoCallingPage />
//               // </ProtectStoreFront>
//             }
//           />
//           <Route
//             path="/chats"
//             element={
//               <ProtectStoreFront>
//                 <UserChat />
//               </ProtectStoreFront>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <ProtectStoreFront>
//                 <LoginForm />
//               </ProtectStoreFront>
//             }
//           />
//           <Route
//             path="/fcm-token"
//             element={
//               // <ProtectStoreFront>
//               <FcmTokenWindow />
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectStoreFront>
//                 <ProfileSection />
//               </ProtectStoreFront>
//             }
//           >
//             <Route
//               index
//               element={
//                 <ProtectStoreFront>
//                   <Voucher />
//                 </ProtectStoreFront>
//               }
//             />
//             <Route
//               path="voucher"
//               element={
//                 <ProtectStoreFront>
//                   <Voucher />
//                 </ProtectStoreFront>
//               }
//             />
//             <Route
//               path="history"
//               element={
//                 <ProtectStoreFront>
//                   <History />
//                 </ProtectStoreFront>
//               }
//             />
//             <Route
//               path="call-chat-logs"
//               element={
//                 <ProtectStoreFront>
//                   <CallChatLogs />
//                 </ProtectStoreFront>
//               }
//             />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </Fragment>
//   );
// }

import React, { Fragment, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyToken } from "./components/Redux/slices/authConsultantSlice";
import { useAppBridge } from "./components/createContext/AppBridgeContext";
import { UseAppInstall } from "./components/ProtectRoute/UseAppInstall";

import ProtectAdminRoute from "./components/ProtectRoute/ProtectAdminRoute";
import ProtectStoreFront from "./components/ProtectRoute/ProtectStoreFront";
import ConsultantProtectedRoute from "./components/ProtectRoute/ConsultantProtectedRoute";
import { BillingProtectedRoute } from "./components/ProtectRoute/BillingProtectedRoute";

import "./App.css";
import { Spinner } from "@shopify/polaris";

/* ---------- Lazy Loaded Pages ---------- */

const LayoutFrame = lazy(() => import("./pages/LayoutFrame"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ConsultantList = lazy(() => import("./pages/ConsultantList"));
const AddConsultant = lazy(() => import("./pages/AddConsultant"));
const Faq = lazy(() => import("./pages/Faq"));
const Voucher = lazy(() => import("./pages/Voucher"));
const History = lazy(() => import("./pages/History"));
const VoucherSettings = lazy(() => import("./pages/VoucherSettings"));
const VoucherTable = lazy(() => import("./pages/VoucherTable"));
const WithdrawalRequest = lazy(() => import("./pages/WithdrawalRequest"));
const AccountInformation = lazy(() => import("./pages/AccountInformation"));
const UserTransHistory = lazy(() => import("./pages/UserTransHistory"));
const ManualDebetCreditBlance = lazy(
  () => import("./pages/ManualDebetCreditBlance"),
);
const AdminPercentage = lazy(() => import("./pages/AdminPercentage"));
const RevenuManagement = lazy(() => import("./pages/RevenuManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ---------- Components ---------- */

const ConsultantCards = lazy(
  () => import("./components/ConsultantCards/ConsultantCards"),
);
const ViewProfile = lazy(
  () => import("./components/ConsultantCards/ViewProfile"),
);

const TabNavigation = lazy(
  () => import("./components/ConsultantDashboard/TabNavigation"),
);
const DashboardPage = lazy(
  () => import("./components/ConsultantDashboard/DashboardPage"),
);
const ChatsPage = lazy(
  () => import("./components/ConsultantDashboard/ChatsPage"),
);
const CallLogsConsultant = lazy(
  () => import("./components/ConsultantDashboard/CallChatLogsConsultant"),
);
const ConsultantWalletLogs = lazy(
  () => import("./components/ConsultantDashboard/ConsultantWalletLogs"),
);
const WithdrawalRequestForm = lazy(
  () => import("./components/ConsultantDashboard/WithdrawalRequestForm"),
);
const WithdrawalRequestTable = lazy(
  () => import("./components/ConsultantDashboard/WithdrawalRequestTable"),
);

const VideoCallingPage = lazy(
  () => import("./components/ConsultantDashboard/VideoCallingPage"),
);

const UserChat = lazy(() => import("./components/ClientDashbord/UserChat"));
const ProfileSection = lazy(
  () => import("./components/ClientDashbord/ProfileSection"),
);
const CallChatLogs = lazy(() => import("./pages/CallChatLogs"));

const LoginForm = lazy(
  () => import("./components/ConsultantDashboard/LoginForm"),
);

const GlobalMessageNotification = lazy(
  () => import("./components/AlertModel/GlobalMessageNotification"),
);
const IncomingCallAlert = lazy(
  () => import("./components/AlertModel/IncommingCallAlert"),
);
const PushCallIncoming = lazy(
  () => import("./components/AlertModel/PushCallIncoming"),
);

const FcmTokenWindow = lazy(() => import("./firebase/utils/FcmTokenWindow"));

/* ---------- App ---------- */

export default function App() {
  const dispatch = useDispatch();

  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  const app = useAppBridge();
  const { installed } = UseAppInstall(shop, app);

  /* Verify token */
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  /* iframe message listener */

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data?.type) return;

      if (event.data.type === "SHOW_TOAST") {
        fetch("/logMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event.data),
        }).catch(console.error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /* iframe auto height */

  const getPageHeight = () =>
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

  const sendHeightToParent = () => {
    if (!window.parent) return;

    window.parent.postMessage(
      {
        type: "AGORA_IFRAME_HEIGHT",
        height: getPageHeight(),
      },
      "*",
    );
  };

  useEffect(() => {
    sendHeightToParent();

    const observer = new ResizeObserver(() => {
      sendHeightToParent();
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return (
    <Fragment>
      <BrowserRouter>
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Spinner size="large" /></div>}>
          <GlobalMessageNotification />
          <IncomingCallAlert />

          <Routes>
            {/* -------- Admin -------- */}

            <Route
              element={
                <ProtectAdminRoute installed={installed}>
                  <BillingProtectedRoute>
                    <LayoutFrame />
                  </BillingProtectedRoute>
                </ProtectAdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/consultant-list" element={<ConsultantList />} />
              <Route
                path="/consultant-list/add-consultant"
                element={<AddConsultant />}
              />
              <Route path="/history" element={<UserTransHistory />} />
              <Route
                path="/wallet-management"
                element={<ManualDebetCreditBlance />}
              />
              <Route
                path="/withdrawal-request"
                element={<WithdrawalRequest />}
              />
              <Route
                path="/account-information"
                element={<AccountInformation />}
              />
              <Route
                path="/voucher-management/voucher"
                element={<VoucherSettings />}
              />
              <Route path="/voucher-management" element={<VoucherTable />} />
              <Route path="/admin-percentage" element={<AdminPercentage />} />
              <Route
                path="/revenue-management"
                element={<RevenuManagement />}
              />
              <Route path="/faq" element={<Faq />} />
            </Route>

            {/* -------- Storefront -------- */}

            <Route
              path="/consultant-cards"
              element={
                <ProtectStoreFront>
                  <ConsultantCards />
                </ProtectStoreFront>
              }
            />

            <Route
              path="/view-profile"
              element={
                <ProtectStoreFront>
                  <ViewProfile />
                </ProtectStoreFront>
              }
            />

            {/* -------- Consultant Dashboard -------- */}

            <Route
              path="/consultant-dashboard/*"
              element={
                <ConsultantProtectedRoute>
                  <TabNavigation />
                </ConsultantProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="chats/:chatId?" element={<ChatsPage />} />
              <Route path="call-chat-logs" element={<CallLogsConsultant />} />
              <Route
                path="consultant-wallet-logs"
                element={<ConsultantWalletLogs />}
              />
              <Route
                path="withdrawal-request"
                element={<WithdrawalRequestForm />}
              />
              <Route
                path="withdrawal-request-table"
                element={<WithdrawalRequestTable />}
              />
            </Route>

            {/* -------- Video Calling -------- */}

            <Route path="/video/calling/page" element={<VideoCallingPage />} />

            {/* -------- Client -------- */}

            <Route
              path="/chats"
              element={
                <ProtectStoreFront>
                  <UserChat />
                </ProtectStoreFront>
              }
            />

            <Route
              path="/login"
              element={
                <ProtectStoreFront>
                  <LoginForm />
                </ProtectStoreFront>
              }
            />

            <Route path="/fcm-token" element={<FcmTokenWindow />} />

            <Route
              path="/profile"
              element={
                <ProtectStoreFront>
                  <ProfileSection />
                </ProtectStoreFront>
              }
            >
              <Route index element={<Voucher />} />
              <Route path="voucher" element={<Voucher />} />
              <Route path="history" element={<History />} />
              <Route path="call-chat-logs" element={<CallChatLogs />} />
            </Route>

            <Route path="/push-call-incoming" element={<PushCallIncoming />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  );
}
