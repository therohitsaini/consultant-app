import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './ProfileSection.module.css';

const ProfileSection = () => {
  return (
    <div className={styles.profileSection}>
      {/* Left side: user image / basic info */}
     

      {/* Right side: profile navigation + nested content */}
      <div className={styles.profileRight}>
        <div className={styles.profileSectionHeader}>
          <h1 className={styles.profileTitle}>Profile Settings</h1>
        </div>

        <div className={styles.profileNav}>
          <NavLink
            to="voucher"
            className={({ isActive }) =>
              isActive
                ? `${styles.profileNavButton} ${styles.profileNavButtonActive}`
                : styles.profileNavButton
            }
          >
            Voucher
          </NavLink>
          <NavLink
            to="history"
            className={({ isActive }) =>
              isActive
                ? `${styles.profileNavButton} ${styles.profileNavButtonActive}`
                : styles.profileNavButton
            }
          >
            History
          </NavLink>
        </div>

        <div className={styles.profileContent}>
          {/* Nested routes for Voucher / History will render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;