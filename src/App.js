import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppBridgeProvider } from "./components/createContext/AppBridgeContext";
import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";
import AddConsultant2 from "./pages/AddConsultant2";
import { Fragment } from "react";

function App() {
  return (
    <Fragment>
      <ui-nav-menu>
        <a href="/" rel="home">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/consultant-list">Consultant List</a>
        <a href="/add-consultant">Add Consultant</a>
        <a href="/add-consultant2">Add Consultant 2</a>
        <a href="/pricing">Pricing</a>
        <a href="/faq">Faq</a>
      </ui-nav-menu>
      <AppBridgeProvider>
        <BrowserRouter>
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
    </Fragment>
  );
}

export default App;
