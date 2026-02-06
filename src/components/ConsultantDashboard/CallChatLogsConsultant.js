import axios from 'axios'
import React, { useEffect, useState } from 'react'
import UserTable from '../ClientDashbord/UserTable'
import { getDuration } from '../Helper/Helper'

const CallLogsConsultant = () => {
    const [callLogsConsultant, setCallLogsConsultant] = useState([])
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState(null)
    const [shopId, setShopId] = useState(null)

    const columns = [
        {
            label: "User Name",
            key: "consultantName",
            render: row => row.user?.fullname || "-",
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
            // render: row => row.type ?? "-",
        },
        {
            label: "Duration",
            key: "duration",
            render: row => getDuration(row.startTime, row.endTime) + " min",
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
            const getCallLogsConsultant = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/find-user-chat-logs/${userId}`
                    )
                    console.log("response", response)
                    if (response.status === 200) {
                        setCallLogsConsultant(response.data.data || [])
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("Error fetching call logs consultant:", error)
                    setCallLogsConsultant([])
                } finally {
                    setLoading(false)
                }
            }
            getCallLogsConsultant()
        }
    }, [userId, shopId])

    return (
        <div style={{ padding: '20px' }}>
            
            <UserTable
                title="Call / Chat Logs"
                columns={columns}
                data={callLogsConsultant}
                loading={loading}
            />
        </div>
    )
}

export default CallLogsConsultant