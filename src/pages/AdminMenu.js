import { NavMenu } from '@shopify/app-bridge-react';
import { useAppBridge } from '../components/createContext/AppBridgeContext';



export function AdminMenu() {
    const app = useAppBridge();
    if (!app) {
        console.warn('⚠️ AdminMenu: App Bridge not initialized, NavMenu will not render');
        return null;
    }

    return (
        <NavMenu>
            {/* First link must have rel="home" and href="/" for home route */}
            <a href="/" rel="home">Dashboard  </a>
            <a href="/consultant-list">Consultant Directory</a>
            <a href="/setting/history"> Activity History</a>
            <a href="/setting/wallet-management">Wallet Management</a>
            <a href="/admin-settings/voucher-management">Voucher</a>
            <a href="/pricing">Pricing</a>
            <a href="/faq">FAQ</a>
        </NavMenu>
    );
}