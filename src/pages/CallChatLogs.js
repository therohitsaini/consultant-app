import React, { useEffect, useState } from 'react'
import UserTable from '../components/ClientDashbord/UserTable'
import axios from 'axios'
import { getDuration } from '../components/Helper/Helper'

function CallChatLogs() {
    const [callChatLogs, setCallChatLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState(null)
    const [shopId, setShopId] = useState(null)

    // Table columns: Consultant Name + Amount
    const columns = [
        {
            label: "Consultant Name",
            key: "consultantName",
            // Assuming consultant is the receiver; change to senderId if needed
            render: row => row.consultant?.fullname || "-",
        },
        {
            label: "Amount",
            key: "amount",
            render: row => `₹${row.amount.toFixed(2)}`,
        },
        {
            label: "Date & Time",
            key: "createdAt",
            render: row => new Date(row.createdAt).toLocaleString(),
        },
        {
            label: "Type",
            key: "type",
            render: row => row.type ?? "-",
        },
        {
            label: "Duration",
            key: "duration",
            render: row => getDuration(row.startTime, row.endTime) + "min",
        },
        {
            label: "Status",
            key: "status",
            render: row => row.status ?? "-",
        },
    ]

    useEffect(() => {
        const userId = localStorage.getItem('client_u_Identity')
        setUserId(userId)
        const shopId = localStorage.getItem('shop_o_Identity')
        setShopId(shopId)
    }, [])

    useEffect(() => {
        if (userId && shopId) {
            const getCallChatLogs = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_HOST}/api/users/find-user-logs-history/${userId}`
                    )
                    setCallChatLogs(response.data.data || [])
                } catch (error) {
                    console.error("Error fetching call/chat logs:", error)
                    setCallChatLogs([])
                } finally {
                    setLoading(false)
                }
            }
            getCallChatLogs()
        }
    }, [userId, shopId])
    console.log("callChatLogs", callChatLogs)

    return (
        <UserTable
            title="Call / Chat Logs"
            columns={columns}
            data={callChatLogs}
            loading={loading}
        />
    )
}

export default CallChatLogs