import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchConsultantById } from "../Redux/slices/ConsultantSlices";
import { formatAmountHelper } from "../Helper/Helper";

const WithdrawalRequestForm = () => {
    const dispatch = useDispatch();

    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const consultantId = localStorage.getItem("client_u_Identity");
    const shopId = localStorage.getItem("shop_o_Identity");

    const { consultantOverview } = useSelector((state) => state.consultants);
    console.log("consultantOverview________________", consultantOverview)
    useEffect(() => {
        if (shopId && consultantId) {
            dispatch(fetchConsultantById({ shop_id: shopId, consultant_id: consultantId }));
        }
    }, [shopId, consultantId]);

    // Fetch Wallet Balance
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_BACKEND_HOST}/api/wallet/${consultantId}/${shopId}`
                );

                setBalance(res.data.balance || 0);
            } catch (err) {
                console.log(err);
            }
        };

        fetchBalance();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) return alert("Enter amount");
        try {
            setLoading(true);

            await axios.post(
                `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/submit/withdrawal/reques/${consultantId}/${shopId}`,
                {
                    amount,
                    note,
                }
            );

            alert("Withdrawal request sent");

            setAmount("");
            setNote("");

        } catch (error) {
            alert("Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coainernt rounded-md d-flex justify-content-center align-items-center" style={{ height: "90vh" }} >
            <div className=""
                style={{ width: "50%" }}
            >

                <div className="card mb-3 shadow-sm">
                    <div className="card-body text-center">
                        <h6 className="text-muted">Available Balance</h6>
                        <h3 className="fw-bold text-success " style={{ fontSize: "24px" }}>₹ {formatAmountHelper(consultantOverview?.consultant?.walletBalance || 0)}</h3>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">

                        <h5 className="mb-3">Withdrawal Request</h5>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter withdrawal amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Note</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Optional message"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Request Withdrawal"}
                            </button>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default WithdrawalRequestForm;
