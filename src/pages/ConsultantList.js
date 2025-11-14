import { Banner, Layout, Page, BlockStack, Grid, LegacyCard } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon, PlusIcon } from '@shopify/polaris-icons';
import { useEffect, useState } from 'react';
import IndexTableList from '../components/consultant-list/IndexTableList';
import { fetchConsultants } from '../components/Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';

const sortOptions = [
    { label: 'Name', value: 'name asc', directionLabel: 'A-Z' },
    { label: 'Name', value: 'name desc', directionLabel: 'Z-A' },
    { label: 'Email Id', value: 'emailId asc', directionLabel: 'A-Z' },
    { label: 'Email Id', value: 'emailId desc', directionLabel: 'Z-A' },
    { label: 'Contact', value: 'contact asc', directionLabel: 'Ascending' },
    { label: 'Contact', value: 'contact desc', directionLabel: 'Descending' },
    { label: 'Profession', value: 'profession asc', directionLabel: 'A-Z' },
    { label: 'Profession', value: 'profession desc', directionLabel: 'Z-A' },
    { label: 'Experience', value: ' experience asc', directionLabel: 'Ascending' },
    { label: 'Experience', value: 'experience desc', directionLabel: 'Descending' },
    { label: 'Conversion Fees', value: 'conversionFees asc', directionLabel: 'Ascending' },
    { label: 'Conversion Fees', value: 'conversionFees desc', directionLabel: 'Descending' },
    { label: 'Status', value: 'status asc', directionLabel: 'A-Z' },
    { label: 'Status', value: 'status desc', directionLabel: 'Z-A' },
];


function ConsultantList() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const itemStrings = [
        'All',
        'chat',
        'voice call',
        'video call',
    ];

    const [consultantsFalbackData, setConsultants] = useState([
        {
            id: '1',
            name: 'John Doe',
            emailId: 'john.doe@example.com',
            contact: '+1 234-567-8900',
            profession: 'Business Consultant',
            experience: '5 years',
            conversionFees: '$500',
            isActive: true,
            type: 'voice call',
        },
        {
            id: '2',
            name: 'Jane Smith',
            emailId: 'jane.smith@example.com',
            contact: '+1 234-567-8901',
            profession: 'Marketing Consultant',
            experience: '8 years',
            conversionFees: '$750',
            isActive: true,
            type: 'chat',
        },
        {
            id: '3',
            name: 'Robert Johnson',
            emailId: 'robert.johnson@example.com',
            contact: '+1 234-567-8902',
            profession: 'IT Consultant',
            experience: '3 years',
            conversionFees: '$400',
            isActive: false,
            type: 'voice call',
        },
        {
            id: '4',
            name: 'Emily Davis',
            emailId: 'emily.davis@example.com',
            contact: '+1 234-567-8903',
            profession: 'Finance Consultant',
            experience: '6 years',
            conversionFees: '$600',
            isActive: true,
            type: 'chat',
        },
        {
            id: '5',
            name: 'Michael Brown',
            emailId: 'michael.brown@example.com',
            contact: '+1 234-567-8904',
            profession: 'HR Consultant',
            experience: '7 years',
            conversionFees: '$650',
            isActive: true,
            type: 'video call',
        },
    ]);
    const dispatch = useDispatch();
    const { consultants, loading: consultantLoading } = useSelector((state) => state.consultants);
    useEffect(() => {
        dispatch(fetchConsultants());
    }, [dispatch]);
    console.log("consultants", consultants.findConsultant);
    console.log("consultantLoading", consultantLoading);
    return (
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
                    <IndexTableList itemStrings={itemStrings} sortOptions={sortOptions} consultantsFalbackData={consultants.findConsultant} setConsultants={setConsultants} />
                </Layout.Section>

            </Layout>
        </Page>
    );
}

export default ConsultantList;