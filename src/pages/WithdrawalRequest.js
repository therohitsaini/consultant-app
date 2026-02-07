import React, { Fragment, useCallback, useEffect, useState } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { Page, Layout, Spinner, ButtonGroup, Button, Toast, Badge } from '@shopify/polaris'
import { DuplicateIcon, EditIcon, PlusIcon } from '@shopify/polaris-icons'
import { IndexTable, Text } from '@shopify/polaris'
import { fetchWalletHistory, fetchWithdrawalRequests } from '../components/Redux/slices/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useAppBridge } from '../components/createContext/AppBridgeContext'
import UpdateUserDetailsModal from './UpdateUserDetailsModal'
import axios from 'axios'
import { ToastModel } from '../components/AlertModel/Tost'
import { getAppBridgeToken } from '../utils/getAppBridgeToken'


const withdrawalRequestHeadings = [
    { title: 'Sr. No.', align: 'center' },
    { title: 'Name', align: 'center'     },
    { title: 'Amount', align: 'center' },
    { title: "Status", align: 'center' },
    { title: "Description", align: 'center' },
    { title: " Action", align: 'center' },
];



function WithdrawalRequest() {
    const app = useAppBridge();
    const { walletHistory, loading: walletLoading } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [page, setPage] = useState(1);
    const [type, setType] = useState(0);
    const [active, setActive] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [updateFormData, setUpdateFormData] = useState({
        userId: '',
        mainType: '',
        amount: '',
        description: '',
    });
    const limit = 10;
    console.log("searchQuery", searchQuery);
    const { withdrawalRequests, loading: withdrawalRequestsLoading } = useSelector((state) => state.admin);
    const openUpdateWalletModal = (userId, fullname) => {
        setActive(true);
        setUserDetails({ userId, fullname });
    }

    useEffect(() => {
        const id = localStorage.getItem('domain_V_id');
        setAdminIdLocal(id);
    }, []);

    useEffect(() => {
        dispatch(fetchWithdrawalRequests({ adminIdLocal, page, limit, app, searchQuery }));
    }, [dispatch, adminIdLocal, page, limit, refresh, searchQuery]);

    console.log("withdrawalRequests", withdrawalRequests);
    /** 
     * Update Wallet
     * 
     */
    const updateWallet = async () => {
        const token = await getAppBridgeToken(app);
        console.log("token", token);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/update-wallet/${adminIdLocal}`, {
                ...updateFormData, userId: userDetails.userId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success === true) {
                setRefresh((prev) => !prev);
            } else {
                setToastActive(true);
            }
        } catch (error) {
            setToastActive(true);
        }
    }

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString();

    const tableData = withdrawalRequests?.data?.map((item) => ({
        id: item?._id,
        userId: item?.consultantId?._id,
        shop_id: item?.shopId || '-',
        fullname: item?.consultantId?.fullname || '-',
        userType: item?.consultantId?.userType || '-',
        amount: item?.amount || '-',
        status: item?.status || '-',
        description: item?.note || '-',
        updatedAt: formatDate(item?.createdAt),
    })) || [];
    const onHandleCancel = () => {
        setPage(1);
        setSearchQuery("");
        setType(0);
        return true;
    };

    const renderWalletRow = useCallback((withdrawal, index) => {
        const { id, userId, shop_Id, fullname, amount, referenceType, status, description } = withdrawal
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

                <IndexTable.Cell alignment="start">
                    <Text variant="bodyMd" as="span" alignment="start" numeric>
                        ${amount ? parseFloat(amount).toFixed(2) : "0.0"}
                    </Text>
                </IndexTable.Cell>


                <IndexTable.Cell alignment="start">
                    <Badge tone={status === "success" ? "success" : "critical"}>
                        {status}
                    </Badge>
                </IndexTable.Cell>

                <IndexTable.Cell alignment="start">
                    <Text variant="bodyMd" as="span">
                        {description}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <ButtonGroup alignment="start">
                        <Button
                            variant="tertiary"
                            icon={EditIcon}
                            accessibilityLabel="Edit wallet"
                            onClick={(e) => {
                                e.stopPropagation();
                                openUpdateWalletModal(userId, fullname, shop_Id);
                                // handleEdit(_id);
                            }}
                        />

                    </ButtonGroup>
                </IndexTable.Cell>

            </IndexTable.Row>
        )
    }, [page, limit])

    return (
        <Fragment>
            <UpdateUserDetailsModal open={active} onClose={() => setActive(false)} userDetails={userDetails} updateFormData={updateFormData} setUpdateFormData={setUpdateFormData} updateWallet={updateWallet} />
            <Page
                title="Withdrawal Request"

            >
                <Layout>
                    <Layout.Section>
                        <IndexTableList
                            itemStrings={[]}
                            sortOptions={[]}
                            data={tableData}
                            headings={withdrawalRequestHeadings}
                            renderRow={renderWalletRow}
                            resourceName={{ singular: 'withdrawal request', plural: 'withdrawal requests' }}
                            queryPlaceholder="Search wallets"
                            onTabChange={(value) => setType(value)}
                            onQueryChange={(value) => { setSearchQuery(value); setPage(1); }}
                            onSortChange={() => { }}
                            page={page}
                            setPage={setPage}
                            setType={setType}
                            limit={limit}
                            totalItems={walletHistory?.totalItems || walletHistory?.data?.length || 0}
                            loading={walletLoading}
                            onHandleCancel={onHandleCancel}
                        />
                    </Layout.Section>
                </Layout>
            </Page>

        </Fragment>
    )
}

export default WithdrawalRequest