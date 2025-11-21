import React from 'react';
import { NavMenu } from '@shopify/app-bridge-react';
import { useLocation } from 'react-router-dom';

function AppNavigation() {
  const location = useLocation();

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

  return (
    <NavMenu
      navigationLinks={navigationItems}
    />
  );
}

export default AppNavigation;

