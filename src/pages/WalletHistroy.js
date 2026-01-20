import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout, Spinner } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchWalletHistory } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useAppBridge } from '../components/createContext/AppBridgeContext'



const walletHeadings = [
    { title: 'Sr. No.' },
    { title: 'Fullname' },
    { title: 'Email' },
    { title: 'Phone' },
    { title: 'User Type' },
    { title: 'Last Updated' },
    { title: 'Wallet Balance' },

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


function WalletHistroy() {
    const app = useAppBridge();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    useEffect(() => {
        const id = localStorage.getItem('doamin_V_id');
        setAdminIdLocal(id);
    }, []);
    const { walletHistory, loading: walletLoading } = useSelector((state) => state.admin);
    console.log("walletHistory", walletHistory);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const limit = 10;


    useEffect(() => {
        dispatch(fetchWalletHistory({ adminIdLocal, page, limit, app }));
    }, [dispatch, adminIdLocal, page, limit]);

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString();

    const tableData = walletHistory?.data?.map((item) => ({
        id: item._id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone || '-',
        userType: item.userType || '-',
        walletBalance: item.walletBalance || '-',
        updatedAt: formatDate(item.updatedAt)
    })) || [];

    const renderWalletRow = useCallback((wallet, index) => {
        const { id, fullname, email, phone, userType, walletBalance, updatedAt } = wallet
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
                        {fullname}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {email}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {phone}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {userType}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {updatedAt}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        ${walletBalance}
                    </Text>
                </IndexTable.Cell>

            </IndexTable.Row>
        )
    }, [page, limit])

    return (
        <Fragment>
            {walletLoading ? (
                <div style={{ padding: '10px', margin: '10px', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner accessibilityLabel="Spinner example" size="large" />
                </div>
            ) : (

                <Page
                    title="Wallet History"
                    primaryAction={{
                        icon: PlusIcon,
                        content: 'Add Wallet',
                        url: '/add-wallet',
                    }}
                >
                    <Layout>
                        <Layout.Section>
                            <IndexTableList
                                itemStrings={[]}
                                sortOptions={transactionSortOptions}
                                data={tableData}
                                headings={walletHeadings}
                                renderRow={renderWalletRow}
                                resourceName={{ singular: 'wallet', plural: 'wallets' }}
                                queryPlaceholder="Search wallets"
                                onTabChange={() => { }}
                                onQueryChange={() => { }}
                                onSortChange={() => { }}
                                page={page}
                                setPage={setPage}
                                limit={limit}
                                totalItems={walletHistory?.totalItems || walletHistory?.data?.length || 0}
                            />
                        </Layout.Section>
                    </Layout>
                </Page>
            )}
        </Fragment>
    )
}

export default WalletHistroy