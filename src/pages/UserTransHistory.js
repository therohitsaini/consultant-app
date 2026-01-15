import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchActivityHistory } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'



const transactionHeadings = [
    { title: 'Sr. No.' },
    { title: 'Type' },
    { title: 'Date' },
    { title: 'Time' },
    { title: 'Duration' },
    { title: 'User' },
    { title: 'Consultant' },
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

const transactionItemStrings = ['All', 'Chat', 'Call', 'Voice Call']

function UserTransHistory() {
    const { activityHistory } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const id = localStorage.getItem('doamin_V_id');
        setAdminIdLocal(id);
    }, []);
    useEffect(() => {
        dispatch(fetchActivityHistory( adminIdLocal, page, limit ));
    }, [dispatch, adminIdLocal]);


    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString();

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getDuration = (start, end) => {
        const diff = (new Date(end) - new Date(start)) / 1000;
        const min = Math.floor(diff / 60);
        return `${min} min`;
    };
    const tableData = activityHistory?.data?.map((item) => ({
        id: item._id,
        type: item.type?.toUpperCase(),
        date: formatDate(item.createdAt),
        time: formatTime(item.startTime),
        duration: getDuration(item.startTime, item.endTime),
        user: item.senderId?.slice(-6),        // ya actual user name later
        consultant: item.receiverId?.slice(-6), // ya actual consultant name
        amount: `$${item.amount}`,
        status: item.status
    })) || [];



    const renderTransactionRow = useCallback((transaction, index) => {
        const { id, type, date, time, duration, user, consultant, amount, status } = transaction

        return (
            <IndexTable.Row id={id} key={id} position={index}>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
                        {index + 1}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {type}
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
                    <Text variant="bodyMd" as="span">
                        {duration}
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
                    <Text as="span" alignment="end" numeric>
                        {amount}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {status}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    }, [])

    return (
        <Fragment>
            <Page
                title="Activity History"
                primaryAction={{
                    icon: PlusIcon,
                    content: 'Add Activity',
                    url: '/add-activity',
                }}
            >
                <Layout>
                    <Layout.Section>
                        <IndexTableList
                            itemStrings={transactionItemStrings}
                            sortOptions={transactionSortOptions}
                            data={tableData}
                            headings={transactionHeadings}
                            renderRow={renderTransactionRow}
                            resourceName={{ singular: 'transaction', plural: 'transactions' }}
                            queryPlaceholder="Search transactions"
                            onTabChange={() => { }}
                            onQueryChange={() => { }}
                            onSortChange={() => { }}
                            page={page} setPage={setPage}
                            limit={limit}
                            activityHistory={activityHistory}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}

export default UserTransHistory