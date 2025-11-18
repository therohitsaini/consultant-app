import { Banner, Layout, Page, BlockStack, Grid, LegacyCard, Text, ButtonGroup, Button } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon, PlusIcon, EditIcon, DuplicateIcon, DeleteIcon } from '@shopify/polaris-icons';
import { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import IndexTableList from '../components/consultant-list/IndexTableList';
import { IndexTable } from '@shopify/polaris';
import { fetchConsultants } from '../components/Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';
import { UserAlert } from '../components/AlertModel/UserAlert';

const sortOptions = [
    { label: 'Name', value: 'name asc', directionLabel: 'A-Z' },
    { label: 'Name', value: 'name desc', directionLabel: 'Z-A' },
    { label: 'Email _id', value: 'email asc', directionLabel: 'A-Z' },
    { label: 'Email _id', value: 'email desc', directionLabel: 'Z-A' },
    { label: 'Contact', value: 'contact asc', directionLabel: 'Ascending' },
    { label: 'Contact', value: 'contact desc', directionLabel: 'Descending' },
    { label: 'Profession', value: 'profession asc', directionLabel: 'A-Z' },
    { label: 'Profession', value: 'profession desc', directionLabel: 'Z-A' },
    { label: 'Experience', value: 'experience asc', directionLabel: 'Ascending' },
    { label: 'Experience', value: 'experience desc', directionLabel: 'Descending' },
    { label: 'Conversion Fees', value: 'conversionFees asc', directionLabel: 'Ascending' },
    { label: 'Conversion Fees', value: 'conversionFees desc', directionLabel: 'Descending' },
    { label: 'Status', value: 'status asc', directionLabel: 'A-Z' },
    { label: 'Status', value: 'status desc', directionLabel: 'Z-A' },
];


function ConsultantList() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [sortValue, setSortValue] = useState(['name asc']);
    const [isUserAlertVisible, setIsUserAlertVisible] = useState(false);

    const itemStrings = [
        'All',
        'chat',
        'voice call',
        'video call',
    ];

    const [consultantsIdSelected, setConsultantsIdSelected] = useState([]);
    const dispatch = useDispatch();
    const { consultants, loading: consultantLoading } = useSelector((state) => state.consultants);

    // State for filtering and sorting


    useEffect(() => {
        dispatch(fetchConsultants());
    }, [dispatch]);

    // Get consultants data from Redux or fallback
    const consultantsData = consultants?.findConsultant || []

    // Filter consultants based on selected tab and search query
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

    // Sort consultants
    const sortedConsultants = useMemo(() => {
        if (!filteredConsultants.length || !sortValue[0]) return filteredConsultants;

        const [field, direction] = sortValue[0].split(' ');
        const sorted = [...filteredConsultants];

        sorted.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle numeric values
            if (field === 'experience' || field === 'conversionFees') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else {
                // Handle string values
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

    // Handle consultant row click
    const handleConsultantClick = useCallback((_id) => {
        console.log("consultant _id", _id);
    }, []);

    // Handle edit button click
    const handleEdit = useCallback((_id) => {
        console.log("consultant _id", _id);
        setIsUserAlertVisible(true);
    }, []);

    // Render row function for consultants
    const renderConsultantRow = useCallback((consultant, index) => {
        const { _id,
            fullname, email, phone, contact, profession, experience,
            fees, consultantStatus
        } = consultant;
        const displayPhone = phone || contact;

        return (

            <IndexTable.Row onClick={() => handleConsultantClick(_id)} _id={_id} key={_id} position={index}>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
                        {index + 1}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {fullname}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{email}</IndexTable.Cell>
                <IndexTable.Cell>{displayPhone}</IndexTable.Cell>
                <IndexTable.Cell>{profession}</IndexTable.Cell>
                <IndexTable.Cell>{experience}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        ${fees}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <label
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
                            checked={consultantStatus
                            }
                            onChange={() => {
                                // Handle status toggle if needed
                                setConsultantsIdSelected((prevConsultants) =>
                                    prevConsultants.map((c) =>
                                        c._id === _id ? { ...c, consultantStatus: !c.consultantStatus } : c
                                    )
                                );
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
                                e.stopPropagation(); // Row click trigger avoid
                                handleEdit(_id);
                            }}
                        />

                        <Button variant="tertiary" icon={DuplicateIcon} accessibilityLabel="Duplicate consultant" />
                        <Button variant="tertiary" icon={DeleteIcon} tone="critical" accessibilityLabel="Delete consultant" />
                    </ButtonGroup>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    }, [handleConsultantClick, handleEdit, setConsultantsIdSelected]);

    const headings = [
        { title: 'Sr. No.' },
        { title: 'Name' },
        { title: 'Email _id' },
        { title: 'Contact' },
        { title: 'Profession' },
        { title: 'Experience' },
        { title: 'Conversion Fees', alignment: 'end' },
        { title: 'Status' },
        { title: 'Action' },
    ];

 

    return (
        <Fragment>
            <UserAlert isUserAlertVisible={isUserAlertVisible} setIsUserAlertVisible={setIsUserAlertVisible} />
            <Page
                title="Consultant List"
                primaryAction={{
                    icon: PlusIcon,
                    content: 'Add Consultant',
                    url: '/add-consultant',
                }}
                secondaryActions={[
                    {
                        content: 'Publish App',
                        external: true,
                        icon: ExternalIcon,
                    },
                ]}
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
                            itemStrings={itemStrings}
                            sortOptions={sortOptions}
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
    );
}

export default ConsultantList;