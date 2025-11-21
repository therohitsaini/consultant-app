import React, { useEffect } from 'react';
import { NavMenu } from '@shopify/app-bridge-react';
import { useLocation } from 'react-router-dom';
import { useAppBridge } from './createContext/AppBridgeContext';

function AppNavigation() {
  const location = useLocation();
  const app = useAppBridge();

  // Debug logging
  useEffect(() => {
    console.log('AppNavigation - App Bridge instance:', app);
    console.log('AppNavigation - Current location:', location.pathname);
    console.log('AppNavigation - Navigation items:', navigationItems);
    
    // Check if NavMenu element exists in DOM
    setTimeout(() => {
      const navMenuElement = document.querySelector('ui-nav-menu');
      console.log('AppNavigation - NavMenu DOM element:', navMenuElement);
      if (navMenuElement) {
        console.log('AppNavigation - NavMenu children:', navMenuElement.children);
      } else {
        console.warn('AppNavigation - NavMenu element not found in DOM');
      }
    }, 1000);
  }, [app, location.pathname]);

  // NavMenu component - Shopify will handle rendering in admin sidebar
  // Using both navigationLinks prop and children for maximum compatibility
  const navigationItems = [
    { label: 'Dashboard', destination: '/dashboard' },
    { label: 'Consultant List', destination: '/consultant-list' },
    { label: 'Add Consultant', destination: '/add-consultant' },
    { label: 'Pricing', destination: '/pricing' },
    { label: 'FAQ', destination: '/faq' },
  ];

  return (
    <NavMenu navigationLinks={navigationItems}>
      <a href="/dashboard">Dashboard</a>
      <a href="/consultant-list">Consultant List</a>
      <a href="/add-consultant">Add Consultant</a>
      <a href="/pricing">Pricing</a>
      <a href="/faq">FAQ</a>
    </NavMenu>
  );
}

export default AppNavigation;

