import React, { useEffect, useState } from "react";
import styles from "./Voucher.module.css";
import axios from "axios";
import { redirect, useOutletContext } from "react-router-dom";
import { fetchUserDetailsByIds, fetchVoucherData } from "../components/Redux/slices/UserSlices";
import { useDispatch, useSelector } from "react-redux";

function Voucher() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [shopId, setShopId] = useState(null);
  // const [voucherData, setVoucherData] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const shop_id = params.get("shopId");
  const userId_params = params.get("userId");
  const { userDetails } = useSelector((state) => state.users);
  const { voucherData, loading } = useSelector((state) => state.users);
  const walletBalance = userDetails?.data?.walletBalance;

  useEffect(() => {
    const adminId = localStorage.getItem("client_u_Identity__");
    const shopId = localStorage.getItem("shop_o_Identity");
    if (adminId && shopId) {
      setUserId(adminId);
      setShopId(shopId);
    }
  }, []);
  useEffect(() => {
    dispatch(fetchUserDetailsByIds(userId || userId_params));
  }, [userId, userId_params]);

  const handleRecharge = async (amount) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/api/draft-order/create-draft-order`,
      {
        amount: amount,
        shop: shop,
        title: "Recharge Amount",
        userId: userId,
      },
    );
    const data = response.data;
    if (response.status === 200) {
      redirect(data.invoiceUrl);
      window.open(data.invoiceUrl, "_blank");
    } else {
      console.log("error", response.data);
    }
  };
  // const getVoucher = async (adminId) => {
  //   const response = await axios.get(
  //     `${process.env.REACT_APP_BACKEND_HOST}/api/users/get/vouchers/${adminId || shop_id}`,
  //     {},
  //   );
  //   console.log("response_____getVoucher", response);
  //   if (response.status === 200) {
  //     setVoucherData(response.data.data);
  //   }
  // };
  useEffect(() => {
    if (shopId) {
      dispatch(fetchVoucherData(shopId));
    }
  }, [shopId]);
  console.log("voucherData", voucherData);

  return (
    <div className={styles.voucherPage}>
      <h1 className={styles.title}>Add Money to Wallet</h1>

      <div className={styles.balanceSection}>
        {/* <span className={styles.balanceLabel}>Available balance:</span> */}
        <span className={styles.balanceValue}>
          Available Balance : {voucherData?.shopCurrency}{walletBalance?.toFixed(2) || "0.0"}
        </span>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Recharge</h2>
      </div>

      <div className={styles.cardGrid}>
        {voucherData?.voucherCode?.map((option) => {
          console.log("option", voucherData.shopCurrency);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleRecharge(option.totalCoin)}
              className={`${styles.rechargeCard} ${
                option.badge ? styles.rechargeCardHighlighted : ""
              }`}
            >
              {option.extraCoin && (
                <span className={styles.badge}>{option.extraCoin}</span>
              )}
              <div className={styles.amount}>{voucherData?.shopCurrency}{option.totalCoin}</div>
              <div className={styles.extra}>Extra : {voucherData?.shopCurrency}{option.extraCoin}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Voucher;
