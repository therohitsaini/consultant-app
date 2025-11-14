import { Layout, Banner, BlockStack, CalloutCard, Page, Grid, LegacyCard, Text, Box } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import { SetupGuideNew } from '../components/dashboard/SetupGuide';
import { AppStatus } from '../components/dashboard/AppStatus';
import LanguageSelector from '../components/dashboard/LanguageSelecter';

function Dashboard() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const apps = [
        {
            name: "Easy Language Translate",
            image: "./images/apps-img/app1.png",
        },
        {
            name: "Blokr Country Redirect & Block",
            image: "./images/apps-img/app2.png",
        },
        {
            name: "Smart Zipcode Validator",
            image: "./images/apps-img/app3.png",
        },
        {
            name: "Badgio: Product Label & Badges",
            image: "./images/apps-img/app4.png",
        },
        {
            name: "Jobo Bundle",
            image: "./images/apps-img/app5.png",
        },
        {
            name: "Stylo Store: Theme Sections",
            image: "./images/apps-img/app6.png",
        },
        {
            name: "AptBook : Appointment Booking",
            image: "./images/apps-img/app7.png",
        },
    ];

    // Duplicate list for infinite loop
    const loopedApps = [...apps, ...apps];


    return (
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
                                        <div style={{ flex: 1 }}>
                                            <Text variant="headingLg" as="h2" fontWeight="bold">
                                                0
                                            </Text>
                                            <Text variant="bodyMd" as="p" tone="subdued">
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
                                            fontSize: '24px'
                                        }}>
                                            📈
                                        </div>
                                        <div style={{ flex: 1 }}>
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
                                                0
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
                                        <div style={{ flex: 1 }}>
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
    );
}

export default Dashboard;