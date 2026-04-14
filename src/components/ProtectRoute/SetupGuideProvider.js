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
        const adminId = localStorage.getItem("domain_V_id");
        if (!adminId) {
            setLoading(false);
            return;
        }
        const checkSetupGuide = async () => {
            const token = await getAppBridgeToken(app);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/menu${adminId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("response", response);
            // setShowSetupGuide(response.data.data);
            // setLoading(false);
        }
        checkSetupGuide();
    }, []);
    return (
        <SetupGuideContext.Provider value={{ showSetupGuide, loading }}>
            {children}
        </SetupGuideContext.Provider>
    )
}
export const useSetupGuide = () => useContext(SetupGuideContext);