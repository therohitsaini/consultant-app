// AdminNavigation.js
import { NavMenu, TitleBar } from '@shopify/app-bridge-react';
import { useAppBridge } from '../components/createContext/AppBridgeContext';

const AdminMenu = () => {
  const app = useAppBridge();
  if (!app) return null; // prevent errors if App Bridge not initialized

  return (
    <>
      <TitleBar title="Consultant App" />
      <NavMenu>
        <a href="/" rel="home">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/consultants">Consultants</a>
        <a href="/settings">Settings</a>
      </NavMenu>
    </>
  );
};

export default AdminMenu;
