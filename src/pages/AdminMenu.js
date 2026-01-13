import { TitleBar, NavMenu } from '@shopify/app-bridge-react';
import { useAppBridge } from '../components/createContext/AppBridgeContext';

const AdminMenu = () => {
    const app = useAppBridge(); // App Bridge instance

    const navMenuItems = [
        { label: 'Dashboard', destination: '/dashboard' },
        { label: 'Consultants', destination: '/consultants' },
        { label: 'Settings', destination: '/settings' },
    ];

    return (
        <>
            <TitleBar title="My App" />
            <NavMenu showNavigationMenu items={navMenuItems} />
        </>
    );
};
export default AdminMenu;