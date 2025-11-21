import { Layout, Banner, BlockStack, CalloutCard, Page, Grid, LegacyCard, Text, Box } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useEffect, useState, useRef } from 'react';
import { animate } from 'framer-motion';
import { TitleBar } from '@shopify/app-bridge-react';
import { useAppBridge } from '../components/createContext/AppBridgeContext';
import { SetupGuideNew } from '../components/dashboard/SetupGuide';
import { AppStatus } from '../components/dashboard/AppStatus';
import LanguageSelector from '../components/dashboard/LanguageSelecter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../components/Redux/slices/UserSlices';
import { fetchConsultants } from '../components/Redux/slices/ConsultantSlices';
import { apps } from '../components/FallbackData/FallbackData';

// Component to display animated count with motion
function AnimatedCount({ value }) {
    const targetValue = value || 0;
    const [displayValue, setDisplayValue] = useState(targetValue);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValueRef = useRef(targetValue);

    useEffect(() => {
        if (value === undefined || value === null) {
            setDisplayValue(0);
            return;
        }

        const startValue = prevValueRef.current;
        prevValueRef.current = value;

        // Only animate if value changed
        if (startValue !== value) {
            setIsAnimating(true);
            const controls = animate(startValue, value, {
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (latest) => {
                    setDisplayValue(Math.round(latest));
                },
                onComplete: () => {
                    setIsAnimating(false);
                },
            });

            return () => controls.stop();
        }
    }, [value]);

    return (
        <span
            key={value}
            style={{
                display: 'inline-block',
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease-out',
            }}
        >
            {displayValue}
        </span>
    );
}

function Dashboard() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const app = useAppBridge();

    // Get host from URL (for debugging)
    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");
    const adminId = params.get("adminId");
    console.log("adminId", adminId);

    useEffect(() => {
        localStorage.setItem('doamin_V_id', "690c374f605cb8b946503ccb");
    }, []);



    // Duplicate list for infinite loop
    const loopedApps = [...apps, ...apps];
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const { consultants, loading: consultantLoading } = useSelector((state) => state.consultants);

    // Get target values
    const userCount = users?.data?.length || 0;
    const consultantCount = consultants?.findConsultant?.length || 0;
    console.log("Dashboard - Host from URL:", host);
    console.log("Dashboard - App Bridge instance:", app);



    useEffect(() => {
        dispatch(fetchConsultants());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    console.log("consultants", consultants);
    console.log(loading);

    return (
        <>
            {/* App Bridge TitleBar - Shopify frame mein title bar dikhane ke liye */}
            {app && (
                <TitleBar title="Dashboard" />
            )}
            <Page
                title="Dashboard"
                primaryAction={<LanguageSelector />}
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
                                title="Welcome to Consultant Management System"
                                tone="info"
                                onDismiss={() => setIsBannerVisible(false)}
                                icon={ConfettiIcon}
                            >
                                <BlockStack gap="200">
                                    <p>Manage your consultants efficiently and track their performance.</p>
                                    <p>Add new consultants, update their status, and monitor consultations.</p>
                                </BlockStack>
                            </Banner>
                        </Layout.Section>
                    )}

                    { /* Stats Cards */}
                    <Layout.Section>
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                <LegacyCard>
                                    <Box padding="400">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: '#E3F2FD',
                                                border: '2px solid #2196F3',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                👥
                                            </div>
                                            <div style={{ flex: 1, color: 'red' }}>
                                                <Text variant="headingLg" as="h2" fontWeight="bold">
                                                    <AnimatedCount value={userCount} />
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued" style={{}}>
                                                    Total Clients
                                                </Text>
                                            </div>
                                        </div>
                                    </Box>
                                </LegacyCard>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                <LegacyCard>
                                    <Box padding="400">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FFF3E0',
                                                border: '2px solid #FF9800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px',
                                                // color: 'red'
                                            }}>
                                                📈
                                            </div>
                                            <div style={{ flex: 1, color: 'red' }}>
                                                <Text variant="headingLg" as="h2" fontWeight="bold">
                                                    0%
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    Conversion Rate
                                                </Text>
                                            </div>
                                        </div>
                                    </Box>
                                </LegacyCard>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                <LegacyCard>
                                    <Box padding="400">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: '#F3E5F5',
                                                border: '2px solid #9C27B0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                💼
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text variant="headingLg" as="h2" fontWeight="bold">
                                                    <AnimatedCount value={consultantCount} />
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    Total Consultations
                                                </Text>
                                            </div>
                                        </div>
                                    </Box>
                                </LegacyCard>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                <LegacyCard>
                                    <Box padding="400">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: '#FFEBEE',
                                                border: '2px solid #F44336',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                💰
                                            </div>
                                            <div style={{ flex: 1, color: 'green' }}>
                                                <Text variant="headingLg" as="h2" fontWeight="bold">
                                                    ₹0.00
                                                </Text>
                                                <Text variant="bodyMd" as="p" tone="subdued">
                                                    Total Revenue
                                                </Text>
                                            </div>
                                        </div>
                                    </Box>
                                </LegacyCard>
                            </Grid.Cell>
                        </Grid>
                    </Layout.Section>

                    { /* App Status */}
                    <Layout.Section>
                        <AppStatus />
                    </Layout.Section>

                    { /* Setup Guide */}
                    <Layout.Section>
                        <SetupGuideNew />
                    </Layout.Section>

                    { /* CalloutCard */}
                    <Layout.Section>
                        <CalloutCard
                            title="Manage Your Consultants Effectively"
                            illustration="/jqv_intro.png"
                            primaryAction={{
                                content: 'View All Consultants',
                                url: '/consultant-list',
                            }}
                        >
                            <p>
                                Access your consultant list to view, edit, and manage all your consultants.
                                Track their availability, status, and consultation history in one place.
                            </p>
                        </CalloutCard>
                    </Layout.Section>


                </Layout>
            </Page>
        </>
    );
}

export default Dashboard;