import { NavMenu } from "@shopify/app-bridge-react";

export default function AdminMenu() {
    return (
        <NavMenu>
            <a href="/" rel="home">Dashboard</a>
            <a href="/consultants">Consultants</a>
            <a href="/settings">Settings</a>
        </NavMenu>
    );
}
