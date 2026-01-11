import { useEffect } from "react";
import { NavigationMenu } from "@shopify/app-bridge/actions";
import { useAppBridge } from "../components/createContext/AppBridgeProvider";

export default function SideMenu() {
    const app = useAppBridge();

    useEffect(() => {
        if (!app) return;

        const navigationMenu = NavigationMenu.create(app, {
            items: [
                {
                    label: "Home",
                    destination: "/",
                },
                {
                    label: "Settings",
                    destination: "/settings",
                },
                {
                    label: "Reports",
                    destination: "/reports",
                },
            ],
        });

        return () => {
            navigationMenu.unsubscribe();
        };
    }, [app]);

    return null; // UI kuch render nahi hota, menu Shopify inject karta hai
}
