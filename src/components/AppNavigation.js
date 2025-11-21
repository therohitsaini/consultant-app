import React, { useEffect } from 'react';
import { NavMenu } from '@shopify/app-bridge-react';
import { useLocation } from 'react-router-dom';
import { useAppBridge } from './createContext/AppBridgeContext';

function AppNavigation() {
  const location = useLocation();
  const app = useAppBridge();

  // Define your navigation items here
  // Update these paths to match your React Router routes
  const navigationItems = [
    {
      label: 'Dashboard',
      destination: '/dashboard',
    },
    {
      label: 'Consultant List',
      destination: '/consultant-list',
    },
    {
      label: 'Add Consultant',
      destination: '/add-consultant',
    },
    {
      label: 'Pricing',
      destination: '/pricing',
    },
    {
      label: 'FAQ',
      destination: '/faq',
    },
  ];

  // Debug logging
  useEffect(() => {
    console.log('AppNavigation - App Bridge instance:', app);
    console.log('AppNavigation - Navigation items:', navigationItems);
    console.log('AppNavigation - Current location:', location.pathname);
  }, [app, location.pathname]);

  // Always render NavMenu - it will only work when App Bridge is initialized
  // Shopify will handle the rendering in the admin sidebar
  return (
    <NavMenu
      navigationLinks={navigationItems}
    />
  );
}

export default AppNavigation;

