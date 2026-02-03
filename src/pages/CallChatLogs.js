import React from 'react'
import UserTable from '../components/ClientDashbord/UserTable'

function CallChatLogs() {




    

    const columns = [
        {
            label: "Name",
            key: "userId",
            render: row => row.userId?.fullname || "-"
        },
        {
            label: "Date & Time",
            key: "createdAt",
            render: row => new Date(row.createdAt).toLocaleString()
        },
        {
            label: "Type",
            key: "transactionType"
        },
        {
            label: "Duration",
            key: "duration",
            render: row => (
                <span className={`badge ${row.direction === "credit" ? "bg-success" : "bg-danger"}`}>
                    {row.direction}
                </span>
            )
        },
        {
            label: "Date",
            key: "createdAt",
            render: row => new Date(row.createdAt).toLocaleString()
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
    return (
        <UserTable
            title="Wallet History"
            columns={columns}
            data={[]}
            loading={false}
        />
    )
}

export default CallChatLogs