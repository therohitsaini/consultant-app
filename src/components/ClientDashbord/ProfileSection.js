import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, redirect } from 'react-router-dom';
import styles from '../../components/ClientDashbord/ProfileSection.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetailsByIds } from '../Redux/slices/UserSlices';
import { FormLayout, TextField } from '@shopify/polaris';
import axios from 'axios';

const ProfileSection = () => {
  const [userId, setUserId] = useState(null);
  const [voucherData, setVoucherData] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const loggedInCustomerId = params.get('logged_in_customer_Id');
  console.log("loggedInCustomerId", loggedInCustomerId);
  console.log("shop", shop);
console.log("userId", userId)
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.users);
  const walletBalance = userDetails?.data?.walletBalance;
  useEffect(() => {
    const storedShop = localStorage.getItem('client_u_Identity');
    setUserId(storedShop);
  }, [shop])

  useEffect(() => {
    dispatch(fetchUserDetailsByIds(userId));
  }, [userId])
  const getVoucher = async (adminId) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/get/vouchers/${adminId}`);
    if (response.status === 200) {
      setVoucherData(response.data.data);
    }
  }
  useEffect(() => {
    getVoucher("690c374f605cb8b946503ccb");
  }, []);

  console.log("vo", voucherData)

 
  return (
    <div className={styles.profileSection}>
      {/* Left side: user image / basic info */}
      <div className={styles.profileSectionHeader}>
        <h1 className={styles.profileTitle}>Profile Settings</h1>
        <div className={styles.profileImageContainer}>
          <div className={styles.profileImage}>
            <img className='h-100 w-100 object-fit-cover' src={"https://imgs.search.brave.com/LgLnG0YyKC78VZULy9IVIpVyQVnacpc2pmuro63xxSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by91c2VyLXByb2Zp/bGUtcG5nLXByb2Zl/c3Npb25hbC1idXNp/bmVzc3dvbWFuLXN0/aWNrZXItdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZF81Mzg3Ni0x/MDQ5MDE3LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"} alt="profile" />
          </div>

        </div>
        <div className={styles.profileName}>
          <FormLayout>
            <TextField
              label="Full Name"
              type="text"
              value={userDetails?.data?.fullname}
              // onChange={handleFieldChange('email')}
              autoComplete="off"
            />
            <TextField
              label="Email"
              type="text"
              value={userDetails?.data?.email}
              // onChange={handleFieldChange('email')}
              autoComplete="off"
            />

          </FormLayout>
        </div>
      </div>
      <div className={styles.profileRight}>
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
          <Outlet context={{ shop, userId, walletBalance, voucherData }} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;