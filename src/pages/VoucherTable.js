import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { Page, Layout, IndexTable, Text, Button, ButtonGroup } from '@shopify/polaris'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { useAppBridge } from '../components/createContext/AppBridgeContext'
import { useMemo } from 'react'
import { DeleteIcon, EditIcon, PlusIcon } from '@shopify/polaris-icons'
import { Redirect } from '@shopify/app-bridge/actions'
import { useDispatch, useSelector } from 'react-redux'
import { deleteVoucher, fetchAdminDetails } from '../components/Redux/slices/adminSlice'
import { UserAlert, UserAlertVoucher } from '../components/AlertModel/UserAlert'

function VoucherTable() {
    const app = useAppBridge();
    const dispatch = useDispatch();
    const redirect = useMemo(() => {
        if (!app) return null;
        return Redirect.create(app);
    }, [app]);

    const goToAddVoucher = () => {
        if (!redirect) return;
        redirect.dispatch(Redirect.Action.APP, '/admin-settings/voucher');
    }

    const [data, setData] = useState([])
    const [sortOptions, setSortOptions] = useState([])
    const [itemStrings, setItemStrings] = useState([])
    const [headings, setHeadings] = useState([
        { title: 'Sr. No.' },
        { title: 'Voucher Code' },
        { title: 'Total Coin' },
        { title: 'Extra Coin' },
        { title: 'Action' }
    ])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [adminIdLocal, setAdminIdLocal] = useState(null)
    const [isUserAlertVisible, setIsUserAlertVisible] = useState(false)
    const [voucherId, setVoucherId] = useState(null)
    const { adminDetails_, loading: adminDetailsLoading } = useSelector((state) => state.admin);
    console.log("adminDetails_VOUCHER", adminDetails_)
    useEffect(() => {
        const id = localStorage.getItem('domain_V_id');
        setAdminIdLocal(id);
    }, [])



    useEffect(() => {
        if (adminIdLocal) {
            dispatch(fetchAdminDetails({ adminIdLocal, app }))
        }
    }, [dispatch, adminIdLocal, app])

    useEffect(() => {
        if (adminDetails_ && adminDetails_.vouchers && Array.isArray(adminDetails_.vouchers)) {
            const mappedVouchers = adminDetails_?.vouchers?.map((voucher, index) => ({
                id: voucher._id || voucher.id || index + 1,
                voucherCode: voucher.voucherCode || `VCH${String(index + 1).padStart(3, '0')}`,
                totalCoin: voucher.totalCoin?.$numberDecimal ? parseFloat(voucher.totalCoin.$numberDecimal) : voucher.totalCoin || 0,
                extraCoin: voucher.extraCoin?.$numberDecimal ? parseFloat(voucher.extraCoin.$numberDecimal) : voucher.extraCoin || 0,
                status: voucher.status || 'Active'
            }));
            setData(mappedVouchers);
            setTotalItems(mappedVouchers.length);
        }
    }, [adminDetails_])
    const handleEdit = (id) => {
        console.log("id", id);
    }
    const handleDeleteClick = (adminIdLocal, id) => {
        setIsUserAlertVisible(true)
        setVoucherId(id)
    }

    const renderVoucherRow = useCallback((voucher, index) => {
        const { id, voucherCode, totalCoin, extraCoin, status } = voucher;

        return (
            <IndexTable.Row id={id} key={id || index} position={index}>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
                        {index + 1}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {voucherCode || 'N/A'}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        {totalCoin}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        {extraCoin}
                    </Text>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <ButtonGroup>
                        <Button
                            variant="tertiary"
                            icon={EditIcon}
                            accessibilityLabel="Edit voucher"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(id);
                            }}
                        />
                        <Button
                            variant="tertiary"
                            icon={DeleteIcon}
                            tone="critical"
                            accessibilityLabel="Delete voucher"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(adminIdLocal, id);
                            }}
                        />
                    </ButtonGroup>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    }, []);

    return (
        <Fragment>
            <UserAlertVoucher isUserAlertVisible={isUserAlertVisible} setIsUserAlertVisible={setIsUserAlertVisible} handleDelete={handleDeleteClick} voucherId={voucherId} />
            <Page
                title="Voucher Table"
                primaryAction={{
                    icon: PlusIcon,
                    content: 'Add Voucher',
                    onAction: goToAddVoucher,
                }}

            >

                <Layout>
                    <Layout.Section>
                        <IndexTableList
                            itemStrings={itemStrings}
                            sortOptions={sortOptions}
                            data={data}
                            headings={headings}
                            renderRow={renderVoucherRow}
                            page={page}

                            setPage={setPage}
                            limit={limit}
                            totalItems={totalItems}
                            loading={adminDetailsLoading}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}

export default VoucherTable