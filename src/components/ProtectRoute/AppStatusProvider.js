import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AppStatusContext = createContext();

export const AppStatusProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [appEnabled, setAppEnabled] = useState(false);
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    console.log("shop", shop);
    const adminIdLocal = localStorage.getItem('shop_o_Identity');

    useEffect(() => {
        const checkAppStatus = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/app-status-verify-app-status`,
                {
                    params: {
                        shop: shop,
                        adminIdLocal: adminIdLocal
                    },

                }
            );
            console.log("response", response);

            setAppEnabled(response.data.data);
            setLoading(false);
        }
        checkAppStatus();
    }, []);



    return (
        <AppStatusContext.Provider value={{ loading, appEnabled }}>
            {children}
        </AppStatusContext.Provider>
    );
};

export const useAppStatus = () => useContext(AppStatusContext);
