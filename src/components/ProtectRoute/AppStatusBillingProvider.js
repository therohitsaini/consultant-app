import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AppStatusBillingContext = createContext();

export const AppStatusProvider = ({ children }) => {
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminId = localStorage.getItem("domain_V_id");
        console.log("adminId", adminId);
        if (!adminId) {
            setLoading(false);
            return;
        }
        const fetchBillingStatus = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/shop/billing-status/${adminId}`);
            console.log("response_________________BILLING  __________________", response);
            // setIsPaid(response.data.data.planStatus === "ACTIVE");
            // setLoading(false);
        }
        fetchBillingStatus();

       
    }, []);

    return (
        <AppStatusBillingContext.Provider value={{ isPaid, loading }}>
            {children}
        </AppStatusBillingContext.Provider>
    );
};

export const useAppStatusBilling = () => useContext(AppStatusBillingContext);
