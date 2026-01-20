import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout, Spinner, ButtonGroup, Button } from '@shopify/polaris'
import { DuplicateIcon, EditIcon, PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchWalletHistory } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useAppBridge } from '../components/createContext/AppBridgeContext'
import UpdateUserDetailsModal from './UpdateUserDetailsModal'
import axios from 'axios'


const walletManagementHeadings = [
    { title: 'Sr. No.' },
    { title: 'Name' },
    { title: " Type" },
    { title: 'Amount' },
    { title: "Direction" },
    { title: " Reference Type" },
    { title: "  status" },
    { title: "  description" },
    { title: "  Action" },
];

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


function ManualDebetCreditBlance() {
    const app = useAppBridge();
    const { walletHistory, loading: walletLoading } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [page, setPage] = useState(1);
    const [active, setActive] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        userId: '',
        mainType: '',
        amount: '',
        description: '',
    });
    console.log("updateFormData", updateFormData);
    const openUpdateWalletModal = (userId, fullname) => {
        setActive(true);
        setUserDetails({ userId, fullname });
    }

    const limit = 10;
    useEffect(() => {
        const id = localStorage.getItem('doamin_V_id');
        setAdminIdLocal(id);
    }, []);

    useEffect(() => {
        dispatch(fetchWalletHistory({ adminIdLocal, page, limit, app }));
    }, [dispatch, adminIdLocal, page, limit]);

    const updateWallet = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/update-wallet`, {
            adminIdLocal,
            // amount,
            ...updateFormData, userId: userDetails.userId,
        });
    }
    useEffect(() => {
        updateWallet();
    }, [adminIdLocal,]);


    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString();

    const tableData = walletHistory?.map((item) => ({
        id: item._id,
        userId: item.userId._id,
        consultantId: item.consultantId._id,
        shop_id: item.shop_id,
        fullname: item.userId.fullname || '-',
        userType: item.userId.userType || '-',
        amount: item.amount || '-',
        transactionType: item.transactionType || '-',
        referenceType: item.referenceType || '-',
        direction: item.direction || '-',
        status: item.status || '-',
        description: item.description || '-',
        updatedAt: formatDate(item.updatedAt),
    })) || [];

    const renderWalletRow = useCallback((wallet, index) => {
        const { id, userId, consultantId, shop_Id, fullname, userType, amount, referenceType, direction, status, description } = wallet
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
                        {userType}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        ${amount}
                    </Text>
                </IndexTable.Cell>
                <div style={{ color: direction === "credit" ? "green" : "red" }}>
                    <IndexTable.Cell>
                        <Text variant="bodyMd" as="span">
                            {direction === "credit" ? "Credit" : "Debit"}
                        </Text>
                    </IndexTable.Cell>
                </div>

                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {referenceType}
                    </Text>
                </IndexTable.Cell>
                <div style={{ color: status === "success" ? "green" : "red" }}>
                    <IndexTable.Cell>
                        <Text variant="bodyMd" as="span">
                            {status}
                        </Text>
                    </IndexTable.Cell>
                </div>

                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {description}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <ButtonGroup>
                        <Button
                            variant="tertiary"
                            icon={EditIcon}
                            accessibilityLabel="Edit consultant"
                            onClick={(e) => {
                                e.stopPropagation();
                                openUpdateWalletModal(userId, fullname, consultantId, shop_Id);
                                // handleEdit(_id);
                            }}
                        />
                        <Button variant="tertiary" icon={DuplicateIcon} accessibilityLabel="Duplicate consultant" />

                    </ButtonGroup>
                </IndexTable.Cell>

            </IndexTable.Row>
        )
    }, [page, limit])

    return (
        <Fragment>
            <UpdateUserDetailsModal open={active} onClose={() => setActive(false)} userDetails={userDetails} updateFormData={updateFormData} setUpdateFormData={setUpdateFormData} />
            <Page
                title="Wallet History"
            // primaryAction={{
            //     icon: PlusIcon,
            //     content: 'Add Wallet',
            //     url: '/add-wallet',
            // }}
            >
                <Layout>
                    <Layout.Section>
                        <IndexTableList
                            itemStrings={[]}
                            sortOptions={transactionSortOptions}
                            data={tableData}
                            headings={walletManagementHeadings}
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
                            loading={walletLoading}
                        />
                    </Layout.Section>
                </Layout>
            </Page>

        </Fragment>
    )
}

export default ManualDebetCreditBlance