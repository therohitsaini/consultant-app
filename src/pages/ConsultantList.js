import { Banner, Layout, Page, BlockStack, Grid, LegacyCard } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon, PlusIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import IndexTableList from '../components/consultant-list/IndexTableList';

function ConsultantList() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

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
                    <IndexTableList />
                </Layout.Section>

            </Layout>
        </Page>
    );
}

export default ConsultantList;