import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchActivityHistory } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'

// Default transaction history data
const defaultTransactionData = [
    {
        id: '1',
        type: 'Chat',
        date: '2024-01-15',
        time: '10:30 AM',
        duration: '45 min',
        user: 'John Doe',
        consultant: 'Dr. John Smith',
        amount: '$25.00',
        status: 'Completed'
    },
    {
        id: '2',
        type: 'Call',
        date: '2024-01-14',
        time: '2:15 PM',
        duration: '30 min',
        user: 'Sarah Johnson',
        consultant: 'Dr. Sarah Johnson',
        amount: '$35.00',
        status: 'Completed'
    },
    {
        id: '3',
        type: 'Voice Call',
        date: '2024-01-13',
        time: '4:45 PM',
        duration: '60 min',
        user: 'Michael Brown',
        consultant: 'Dr. Michael Brown',
        amount: '$50.00',
        status: 'Completed'
    },
    {
        id: '4',
        type: 'Chat',
        date: '2024-01-12',
        time: '9:00 AM',
        duration: '20 min',
        user: 'Emily Davis',
        consultant: 'Dr. Emily Davis',
        amount: '$15.00',
        status: 'Completed'
    },
    {
        id: '5',
        type: 'Call',
        date: '2024-01-11',
        time: '3:30 PM',
        duration: '25 min',
        user: 'Robert Wilson',
        consultant: 'Dr. Robert Wilson',
        amount: '$30.00',
        status: 'Completed'
    },
    {
        id: '6',
        type: 'Voice Call',
        date: '2024-01-10',
        time: '11:20 AM',
        duration: '50 min',
        user: 'Lisa Anderson',
        consultant: 'Dr. Lisa Anderson',
        amount: '$45.00',
        status: 'Completed'
    },
    {
        id: '7',
        type: 'Chat',
        date: '2024-01-09',
        time: '1:00 PM',
        duration: '35 min',
        user: 'James Taylor',
        consultant: 'Dr. James Taylor',
        amount: '$20.00',
        status: 'Completed'
    },
    {
        id: '8',
        type: 'Call',
        date: '2024-01-08',
        time: '5:15 PM',
        duration: '40 min',
        user: 'Maria Garcia',
        consultant: 'Dr. Maria Garcia',
        amount: '$40.00',
        status: 'Completed'
    }
]

// Headings for transaction history
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

// Sort options for transaction history
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

// Tab strings for filtering
const transactionItemStrings = ['All', 'Chat', 'Call', 'Voice Call']

function UserTransHistory() {
    const { activityHistory } = useSelector((state) => state.admin);
    console.log("activityHistory", activityHistory);
    const dispatch = useDispatch();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    useEffect(() => {
        const id = localStorage.getItem('doamin_V_id');
        setAdminIdLocal(id);
    }, []);
    useEffect(() => {
        dispatch(fetchActivityHistory(adminIdLocal));
    }, [dispatch, adminIdLocal]);

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
                            data={defaultTransactionData}
                            headings={transactionHeadings}
                            renderRow={renderTransactionRow}
                            resourceName={{ singular: 'transaction', plural: 'transactions' }}
                            queryPlaceholder="Search transactions"
                            onTabChange={() => { }}
                            onQueryChange={() => { }}
                            onSortChange={() => { }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}

export default UserTransHistory