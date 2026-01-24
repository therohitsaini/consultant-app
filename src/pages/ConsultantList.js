import { Banner, Layout, Page, BlockStack, Grid, LegacyCard, Text, ButtonGroup, Button, Thumbnail, Spinner } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon, PlusIcon, EditIcon, DuplicateIcon, DeleteIcon } from '@shopify/polaris-icons';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import IndexTableList from '../components/consultant-list/IndexTableList';
import { IndexTable } from '@shopify/polaris';
import { deleteConsultantById, fetchConsultants } from '../components/Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';
import { UserAlert } from '../components/AlertModel/UserAlert';
import { headings, itemStrings, sortOptions } from '../components/FallbackData/FallbackData';
import { Toast, ToastModel } from '../components/AlertModel/Tost';
import axios from 'axios';
import { useAppBridge } from '../components/createContext/AppBridgeContext';
import { Redirect } from '@shopify/app-bridge/actions';




function ConsultantList() {
    const app = useAppBridge();
    const dispatch = useDispatch();

    const redirect = useMemo(() => {
        if (!app) return null;
        return Redirect.create(app);
    }, [app]);

    const goToAddConsultant = () => {
        if (!redirect) return;
        redirect.dispatch(Redirect.Action.APP, '/add-consultant');
    };

    const goToEditConsultant = (id) => {
        if (!redirect) return;
        redirect.dispatch(Redirect.Action.APP, `/add-consultant?id=${id}`);
    };

    const navigate = useNavigate();
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [sortValue, setSortValue] = useState(['name asc']);
    const [isUserAlertVisible, setIsUserAlertVisible] = useState(false);
    const [consultantId, setConsultantId] = useState(null);
    const [active, setActive] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const { consultants, loading: consultantLoading } = useSelector((state) => state.consultants);
    useEffect(() => {
        const id = localStorage.getItem('domain_V_id') || '690c374f605cb8b946503ccb';
        setAdminIdLocal(id);
    }, []);
    console.log("adminIdLocal", consultants);

    useEffect(() => {
        if (!adminIdLocal) return;
        dispatch(fetchConsultants({ adminIdLocal, app }));
    }, [dispatch, isRefreshed, adminIdLocal, app]);

    const consultantsData = consultants?.findConsultant || []
    console.log("consultantsData", consultantsData)
    const filteredConsultants = useMemo(() => {
        if (!consultantsData) return [];

        return consultantsData.filter((consultant) => {
            // Filter by tab
            let matchesTab = true;
            if (selectedTab !== 0) {
                const selectedTabLabel = itemStrings[selectedTab].toLowerCase();
                matchesTab = consultant.type?.toLowerCase() === selectedTabLabel;
            }

            // Filter by search query
            let matchesQuery = true;
            if (queryValue.trim()) {
                const query = queryValue.toLowerCase();
                matchesQuery =
                    consultant.name?.toLowerCase().includes(query) ||
                    consultant.email?.toLowerCase().includes(query) ||
                    consultant.contact?.toLowerCase().includes(query) ||
                    consultant.phone?.toLowerCase().includes(query) ||
                    consultant.profession?.toLowerCase().includes(query);
            }

            return matchesTab && matchesQuery;
        });
    }, [consultantsData, selectedTab, queryValue, itemStrings]);

    const sortedConsultants = useMemo(() => {
        if (!filteredConsultants.length || !sortValue[0]) return filteredConsultants;

        const [field, direction] = sortValue[0].split(' ');
        const sorted = [...filteredConsultants];

        sorted.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (field === 'experience' || field === 'conversionFees') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else {
                aValue = String(aValue || '').toLowerCase();
                bValue = String(bValue || '').toLowerCase();
            }
            if (direction === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });

        return sorted;
    }, [filteredConsultants, sortValue]);

    const handleConsultantClick = useCallback((_id) => {
        console.log("consultant _id", _id);
    }, []);

    const handleEdit = useCallback((_id) => {
        navigate(`/add-consultant?id=${_id}`);
    }, [navigate]);

    // Handle delete confirmation
    const handleDeleteClick = useCallback((_id) => {
        setConsultantId(_id);
        setIsUserAlertVisible(true);
    }, []);


    const handleToggle = async (id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/api-consultant-update-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                dispatch(fetchConsultants({ adminIdLocal, app }));
                setIsRefreshed((prev) => !prev);
            }
        } catch (err) {
            console.error("Failed to update");
        }
    };

    const handleDelete = async () => {
        try {
            const url = `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/delete-consultant/${consultantId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setActive(true);
                console.log("Consultant deleted successfully");
                setIsUserAlertVisible(false);
                setIsRefreshed((prev) => !prev);

            } else {
                console.log("Failed to delete consultant");
            }
        } catch (error) {
            console.error('Error deleting consultant:', error);
        }
    }

    const renderConsultantRow = useCallback((consultant, index) => {
        const { _id, fullname, email, phone, contact, profession, experience, chatPerMinute
            , consultantStatus, voicePerMinute, videoPerMinute
        } = consultant;
        const displayPhone = phone || contact;

        return (


            <IndexTable.Row _id={_id} key={_id} position={index}>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
                        {index + 1}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>

                    <Thumbnail

                        source={
                            consultant?.profileImage
                                ? `${consultant.profileImage.replace(/\\/g, "/")}`
                                : "/images/flag/teamdefault.png"
                        }
                        size="small"
                    />

                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {fullname}
                    </Text>
                </IndexTable.Cell>


                <IndexTable.Cell>{email}</IndexTable.Cell>
                <IndexTable.Cell>{displayPhone}</IndexTable.Cell>
                <IndexTable.Cell>{profession}</IndexTable.Cell>
                <IndexTable.Cell>{experience + " years"}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        ${chatPerMinute || "-"}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        ${voicePerMinute || "-"}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        ${videoPerMinute || "-"}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <label
                        onClick={() => handleToggle(_id)}
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '36px',
                            height: '20px',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={consultantStatus}
                            onChange={() => {
                                console.log("Clicked ID:", _id);

                            }}


                            style={{
                                opacity: 0,
                                width: 0,
                                height: 0,
                            }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: consultantStatus ? 'var(--p-color-bg-fill-brand)' : 'var(--p-color-bg-fill-selected)',
                                borderRadius: '11px',
                                transition: 'background-color 0.2s ease',
                            }}
                        >
                            <span
                                style={{
                                    position: 'absolute',
                                    height: '16px',
                                    width: '16px',
                                    left: consultantStatus ? '18px' : '2px',
                                    top: '2px',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    transition: 'left 0.2s ease',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                }}
                            />
                        </span>
                    </label>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <ButtonGroup>
                        <Button
                            variant="tertiary"
                            icon={EditIcon}
                            accessibilityLabel="Edit consultant"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(_id);
                            }}
                        />
                        <Button
                            variant="tertiary"
                            icon={DeleteIcon}
                            tone="critical"
                            accessibilityLabel="Delete consultant"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(_id);
                            }}
                        />
                    </ButtonGroup>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    }, [handleConsultantClick, handleEdit, handleDeleteClick, isRefreshed]);




    return (
        <Fragment>
           
                <Fragment>
                    <UserAlert
                        isUserAlertVisible={isUserAlertVisible}
                        setIsUserAlertVisible={setIsUserAlertVisible}
                        handleDelete={handleDelete}
                        consultantId={consultantId}

                    />
                    {/* <ToastModel active={active} setActive={setActive} toastContent={toastContent} /> */}
                    <Page
                        title="Consultant List"
                        primaryAction={{
                            icon: PlusIcon,
                            content: 'Add Consultant',
                            onAction: goToAddConsultant,
                        }}
                       
                    >
                        <Layout>

                            { /* Banner */}
                            {isBannerVisible && (
                                <Layout.Section>
                                    <Banner
                                        title="Hi om suman. Welcome To: Your Shopify Store"
                                        tone="info"
                                        onDismiss={() => setIsBannerVisible(false)}
                                        icon={ConfettiIcon}
                                    >
                                        <BlockStack gap="200">
                                            <p>Make sure you know how these changes affect your store.</p>
                                            <p>Make sure you know how these changes affect your store.</p>
                                        </BlockStack>
                                    </Banner>
                                </Layout.Section>
                            )}

                            <Layout.Section>
                                <IndexTableList
                                    loading={consultantLoading}
                                    itemStrings={itemStrings}
                                    sortOptions={[]}
                                    data={sortedConsultants}
                                    headings={headings}
                                    renderRow={renderConsultantRow}
                                    resourceName={{ singular: 'consultant', plural: 'consultants' }}
                                    queryPlaceholder="Search consultants"
                                    onTabChange={setSelectedTab}
                                    onQueryChange={setQueryValue}
                                    onSortChange={setSortValue}
                                />
                            </Layout.Section>
                        </Layout>
                    </Page>
                </Fragment>
          
        </Fragment>
    );
}

export default ConsultantList;