import { NavMenu } from '@shopify/app-bridge-react';
import { useAppBridge } from '../components/createContext/AppBridgeContext';
import { useEffect } from 'react';



export function AdminMenu() {
    const app = useAppBridge();


    //   useEffect(() => {
    //     // Debug: Check if App Bridge script is loaded
    //     console.log('🔍 AdminMenu Debug:', {
    //       appInitialized: !!app,
    //       windowShopify: typeof window !== 'undefined' && typeof window.shopify !== 'undefined',
    //       uiNavMenuExists: typeof window !== 'undefined' && customElements.get('ui-nav-menu'),
    //     });

    //     // Check if ui-nav-menu web component is registered
    //     if (typeof window !== 'undefined') {
    //       customElements.whenDefined('ui-nav-menu').then(() => {
    //         console.log('✅ ui-nav-menu web component is registered');
    //       }).catch(() => {
    //         console.warn('⚠️ ui-nav-menu web component not found - App Bridge script may not be loaded');
    //       });
    //     }
    //   }, [app]);

    // Only render NavMenu if App Bridge is initialized
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
            <a href="/pricing">Pricing</a>
            <a href="/faq">FAQ</a>
            <a href="/setting/history">Recharge History</a>
        </NavMenu>
    );
}