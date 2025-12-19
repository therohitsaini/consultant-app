import React, { useEffect } from "react";
import styles from "./Voucher.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../components/Redux/slices/UserSlices";
import axios from "axios";
import { redirect } from "react-router-dom";

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
    // const { user } = useSelector(state => state.user);
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(fetchUsers());
    // }, []);
    // console.log("user", user)
    const handleRecharge = async (amount) => {
        console.log("amount", amount)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/draft-order/create-draft-order`, {
            amount: amount,
            shop: "rohit-12345839.myshopify.com",
            title: "Recharge Amount",
            userId: "69328ff18736b56002ef83df",
        });
        const data = response.data;
        console.log("data", data)
        if (response.status === 200) {
            console.log("response", data.invoiceUrl)
            redirect(data.invoiceUrl)
            window.open(data.invoiceUrl, "_blank")
            // toast.success("Recharge successful")
        } else {
            toast.error("Recharge failed")
        }
    }

    return (
        <div className={styles.voucherPage}>
            <h1 className={styles.title}>Add Money to Wallet</h1>

            <div className={styles.balanceSection}>
                <span className={styles.balanceLabel}>Available balance:</span>
                <span className={styles.balanceValue}>₹ 0</span>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Popular Recharge</h2>
            </div>

            <div className={styles.cardGrid}>
                {rechargeOptions.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => handleRecharge(option.amount)}
                        className={`${styles.rechargeCard} ${option.badge ? styles.rechargeCardHighlighted : ""
                            }`}
                    >
                        {option.badge && (
                            <span className={styles.badge}>{option.badge}</span>
                        )}
                        <div className={styles.amount}>₹{option.amount}</div>
                        <div className={styles.extra}>{option.extra}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Voucher;
