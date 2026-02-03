import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout, SkeletonBodyText, Spinner } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchActivityHistory } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useAppBridge } from '../components/createContext/AppBridgeContext'



const transactionHeadings = [
    { title: 'Sr. No.' },
    { title: 'User' },
    { title: 'Consultant' },
    { title: 'Date' },
    { title: 'Time' },
    { title: 'Type' },
    { title: 'Duration' },
    { title: 'Amount', alignment: 'end' },
    { title: 'Status' }
]

const transactionSortOptions = [
    { label: 'Date', value: 'date asc', directionLabel: 'Oldest First' },
    { label: 'Date', value: 'date desc', directionLabel: 'Newest First' },
    { label: 'Type', value: 'type asc', directionLabel: 'A-Z' },
    { label: 'Type', value: 'type desc', directionLabel: 'Z-A' },
    { label: 'Amount', value: 'amount asc', directionLabel: 'Low to High' },
    { label: 'Amount', value: 'amount desc', directionLabel: 'High to Low' },
    { label: 'Duration', value: 'duration asc', directionLabel: 'Shortest First' },
    { label: 'Duration', value: 'duration desc', directionLabel: 'Longest First' }
]

const transactionItemStrings = ['All', 'Chat', 'Voice Call', 'Video Call',]

function UserTransHistory() {
    const app = useAppBridge();
    console.log("app", app);
    const { activityHistory, loading } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [type, setType] = useState(0);
    const limit = 10;

    useEffect(() => {
        const id = localStorage.getItem('domain_V_id');
        setAdminIdLocal(id);
    }, []);
    useEffect(() => {
        if (adminIdLocal) {
            dispatch(fetchActivityHistory({ adminIdLocal, page, limit, type, app, searchQuery }));
        }
    }, [dispatch, adminIdLocal, page, limit, type, searchQuery]);


    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString();

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getDuration = (start, end) => {
        if (!start || !end) return "00:00";   
        const diffMs = new Date(end) - new Date(start);
        if (diffMs <= 0) return "00:00";   
        const diff = Math.floor(diffMs / 1000);
        const m = String(Math.floor(diff / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        return `${m}:${s}`;
    };
    const onHandleCancel = () => {
        setPage(1);
        setSearchQuery("");
        setType(0);
        return true;
    };


    const tableData = activityHistory?.data?.map((item) => ({
        id: item._id,
        type: item.type?.toUpperCase(),
        date: formatDate(item.createdAt),
        time: formatTime(item.startTime),
        duration: getDuration(item.startTime, item.endTime),
        user: item.senderId?.fullname,
        consultant: item.receiverId?.fullname,
        amount: `$${item.amount}`,
        status: item.status
    })) || [];
    console.log("tableData", tableData);
    const renderTransactionRow = useCallback((transaction, index) => {
        const { id, user, type, date, time, duration, consultant, amount, status } = transaction
        const serialNumber = (page - 1) * limit + index + 1;

        return (

            <IndexTable.Row id={id} key={id} position={index}>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
                        {serialNumber}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {user}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {consultant}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {date}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {time}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>

                    <div style={{ textTransform: 'lowercase' }}>
                        <Text variant="bodyMd" as="span"  >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                    </div>
                </IndexTable.Cell>


                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {duration}
                    </Text>
                </IndexTable.Cell>


                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        {amount}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div style={{ color: status === "active" ? "green" : "black" }}>
                        <Text variant="bodyMd" as="span">
                            {status}
                        </Text>
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row >
        )
    }, [page, limit])

    return (
        <Fragment>


            <Page
                title="Activity History"

            >
                <Layout>
                    <Layout.Section>
                        <IndexTableList
                            itemStrings={transactionItemStrings}
                            sortOptions={[]}
                            data={tableData}
                            headings={transactionHeadings}
                            renderRow={renderTransactionRow}
                            resourceName={{ singular: 'transaction', plural: 'transactions' }}
                            queryPlaceholder="Search transactions"
                            onTabChange={() => { }}
                            onHandleCancel={onHandleCancel}
                            onQueryChange={(value) => {
                                setSearchQuery(value);
                                setPage(1);
                            }}
                            onSortChange={() => { }}
                            page={page}
                            setPage={setPage}
                            setType={setType}
                            limit={limit}
                            totalItems={activityHistory?.totalItems || activityHistory?.data?.length || 0}
                            loading={loading}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}

export default UserTransHistory