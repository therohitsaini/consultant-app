import { createContext, useContext, useEffect, useState } from "react";
import { useAppBridge } from "../createContext/AppBridgeContext";
import { getAppBridgeToken } from "../../utils/getAppBridgeToken";
import axios from "axios";

const SetupGuideContext = createContext(null);

export const SetupGuideProvider = ({ children }) => {
  const app = useAppBridge();

  const [loading, setLoading] = useState(true);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    const checkSetupGuide = async () => {
      try {
        const adminId = localStorage.getItem("domain_V_id");

        if (!adminId) {
          setLoading(false);
          return;
        }

        const token = await getAppBridgeToken(app);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/api/admin/menu/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("response", response.data.menuSetupComplete);
        if (response.data.menuSetupComplete === true || response.data.menuSetupComplete === "true") {
            setShowSetupGuide(true);
            console.log("showSetupGuide", showSetupGuide);
          } else {
            setShowSetupGuide(false);
            console.log("showSetupGuide", showSetupGuide);
          }
      } catch (error) {
        console.error("SetupGuide error:", error);
        setShowSetupGuide(false);
      } finally {
        setLoading(false);
      }
    };

    if (app) {
      checkSetupGuide();
    }
  }, [app]);

  return (
    <SetupGuideContext.Provider value={{ showSetupGuide, loading, setShowSetupGuide }}>
      {children}
    </SetupGuideContext.Provider>
  );
};

export const useSetupGuide = () => useContext(SetupGuideContext);
