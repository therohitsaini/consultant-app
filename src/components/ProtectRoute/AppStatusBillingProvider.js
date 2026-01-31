import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAppBridge } from "../createContext/AppBridgeContext";
import { getAppBridgeToken } from "../../utils/getAppBridgeToken";

const AppStatusBillingContext = createContext(null);

export const AppStatusBillingProvider = ({ children }) => {
    const app = useAppBridge();
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminId = localStorage.getItem("domain_V_id");
        if (!adminId) {
            setLoading(false);
            return;
        }

        const fetchBillingStatus = async () => {
            const token = await getAppBridgeToken(app);
            console.log("token", token);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_HOST}/api/admin/shop/billing-status/${adminId}`
                    , {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const planStatus = response?.data?.data?.planStatus;
                setIsPaid(planStatus === "ACTIVE");
            } catch (err) {
                console.error("Billing check failed", err);
                setIsPaid(false);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingStatus();
    }, []);

    return (
        <AppStatusBillingContext.Provider value={{ isPaid, loading }}>
            {children}
        </AppStatusBillingContext.Provider>
    );
};

export const useAppStatusBilling = () => useContext(AppStatusBillingContext);
