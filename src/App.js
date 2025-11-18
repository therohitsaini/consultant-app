import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LayoutFrame from "./pages/LayoutFrame";
import Dashboard from "./pages/Dashboard";
import ConsultantList from "./pages/ConsultantList";
import AddConsultant from "./pages/AddConsultant";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";

function App() {
// const location= useLocation();

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
          <Route path="/dashboard" element={<LayoutFrame><Dashboard /></LayoutFrame>} />
          <Route path="/consultant-list" element={<LayoutFrame><ConsultantList /></LayoutFrame>} />
          <Route path="/add-consultant" element={<LayoutFrame><AddConsultant /></LayoutFrame>} />
          <Route path="/pricing" element={<LayoutFrame><Pricing /></LayoutFrame>} />
          <Route path="/faq" element={<LayoutFrame><Faq /></LayoutFrame>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
