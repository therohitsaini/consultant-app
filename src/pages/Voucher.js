import React, { useEffect } from "react";
import styles from "./Voucher.module.css";
import axios from "axios";
import { redirect, useOutletContext } from "react-router-dom";

const rechargeOptions = [
    { id: 1, amount: "100", extra: " 100 Extra" },
    { id: 2, amount: " 200", extra: "₹ 200 Extra" },
    { id: 3, amount: "500", extra: "₹ 200 Extra", badge: "Popular" },
    { id: 4, amount: "1000", extra: "₹ 200 Extra", badge: "Popular" },
    { id: 5, amount: "2000", extra: "₹ 200 Extra" },
    { id: 6, amount: "3000", extra: "₹ 300 Extra" },
    { id: 7, amount: "4000", extra: "₹ 480 Extra" },
    { id: 8, amount: "8000", extra: "₹ 960 Extra" },
    { id: 9, amount: "15000", extra: "₹ 2250 Extra" },
    { id: 10, amount: "20000", extra: "₹ 3000 Extra" },
    { id: 11, amount: "50000", extra: "₹ 10000 Extra" },
    { id: 12, amount: "100000", extra: "₹ 20000 Extra" },
];



function Voucher() {
    const { shop, userId, walletBalance, voucherData } = useOutletContext();
    const handleRecharge = async (amount) => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/draft-order/create-draft-order`, {
            amount: amount,
            shop: shop,
            title: "Recharge Amount",
            userId: userId,
        });
        const data = response.data;
        if (response.status === 200) {
            redirect(data.invoiceUrl)
            window.open(data.invoiceUrl, "_blank")
        } else {
            console.log("error", response.data)
        }
    }
    console.log("voucherData", voucherData)

    return (
        <div className={styles.voucherPage}>
            <h1 className={styles.title}>Add Money to Wallet</h1>

            <div className={styles.balanceSection}>
                {/* <span className={styles.balanceLabel}>Available balance:</span> */}
                <span className={styles.balanceValue}>Coins : {walletBalance}</span>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Popular Recharge</h2>
            </div>

            <div className={styles.cardGrid}>
                {voucherData?.voucherCode?.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => handleRecharge(option.totalCoin)}
                        className={`${styles.rechargeCard} ${option.badge ? styles.rechargeCardHighlighted : ""
                            }`}
                    >
                        {option.extraCoin && (
                            <span className={styles.badge}>{option.extraCoin}</span>
                        )}
                        <div className={styles.amount}>₹{option.totalCoin}</div>
                        <div className={styles.extra}>Extra : {option.extraCoin}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Voucher;
