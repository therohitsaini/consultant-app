import React, { useEffect, useState } from 'react'
import UserTable from '../ClientDashbord/UserTable'
import axios from 'axios'

const ConsultantWalletLogs = () => {
    const [walletLogs, setWalletLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState(null)
    const [shopId, setShopId] = useState(null)

    useEffect(() => {
        const userId = localStorage.getItem('client_u_Identity')
        setUserId(userId)
        const shopId = localStorage.getItem('shop_o_Identity')
        setShopId(shopId)
    }, [])
    const columns = [
        {
            label: "Name",
            key: "userId",
            render: row => row.userId?.fullname || "-"
        },
        {
            label: "Amount",
            key: "amount",
            render: row => `₹${row.amount.toFixed(2)}`
        },
        {
            label: "Type",
            key: "transactionType"
        },
        {
            label: "Direction",
            key: "direction",
            render: row => (
                <span className={`badge ${row.direction === "credit" ? "bg-success" : "bg-danger"}`}>
                    {row.direction}
                </span>
            )
        },
        {
            label: "Status",
            key: "status",
            render: row => (
                <span className={`badge ${row.status === "success" ? "bg-success" : "bg-warning"}`}>
                    {row.status}
                </span>
            )
        },
        {
            label: "Date",
            key: "createdAt",
            render: row => new Date(row.createdAt).toLocaleString()
        }
    ];

    const getWalletLogs = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/find-coonsultant/wallet/history/${userId}/${shopId}`)
            console.log("response__________", response)
            if (response.status === 200) {
                setWalletLogs(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching wallet logs:", error)
            setWalletLogs([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (userId && shopId) {
            getWalletLogs()
        }
    }, [userId, shopId])

    return (
        <div style={{ padding: '20px' }}>
            <UserTable
                title="Consultant Wallet Logs"
                columns={columns}
                data={walletLogs}
                loading={loading}
            />
        </div>
    )
}
export default ConsultantWalletLogs