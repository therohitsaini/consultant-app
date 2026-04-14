import React, { useState, useEffect } from "react";
import { useSetupGuide } from "./SetupGuideProvider";
import BlankModalSetupGuide from "../dashboard/BlankModalSetupGuide";
import { Spinner } from "@shopify/polaris";

const SetupGuideProtectRoutes = ({ children }) => {
  const { showSetupGuide, loading, setShowSetupGuide } = useSetupGuide();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!loading && showSetupGuide === true) {
      setOpen(true);
    }
  }, [loading, showSetupGuide]);

  const handleClose = () => {
    setOpen(false);
    setShowSetupGuide(false); // ✅ THIS IS THE KEY FIX
  };

  if (showSetupGuide === true && open) {
    return (
      <BlankModalSetupGuide open={open} onClose={handleClose} />
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="large" />
      </div>
    );
  }

  return children;
};

export default SetupGuideProtectRoutes;
