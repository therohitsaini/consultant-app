import { Outlet } from "react-router-dom";

export function CustomerProtected({ loggedInCustomerId, shop }) {
    if (!loggedInCustomerId) {
        window.top.location.href = `https://${shop}/account/login`;
        return null;
    }

    return <Outlet />;
}
