import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AppStatusContext = createContext();

export const AppStatusProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [appEnabled, setAppEnabled] = useState(false);
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const shop_id = params.get('shopid') 
    const user_id = params.get('customerId');
    useEffect(() => {
        if (shop || user_id || shop_id) {
            if (shop_id) localStorage.setItem('shop_o_Identity', shop_id);
            if (user_id) localStorage.setItem('client_u_Identity__', user_id);
        }
    }, [shop, user_id, shop_id])

    useEffect(() => {
        const checkAppStatus = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/app-status-verify-app-status`,
                {
                    params: {
                        shop: shop,
                        adminIdLocal: shop_id
                    },

                }
            );

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
