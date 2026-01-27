import { Layout, Banner, Link, Grid, BlockStack, Card, Text, Box, Button, ButtonGroup, InlineStack, Icon, Page } from '@shopify/polaris';
import { CheckIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useState } from 'react';

const PricingCard = ({ title, description, price, features, featuredText, button, frequency }) => {
    return (
        <div
            style={{
                borderRadius: ".75rem",
                position: "relative",
                zIndex: "0",
            }}
        >
            {featuredText ? (
                <div style={{ position: "absolute", width: "100px", height: "100px", overflow: "hidden", left: "unset", bottom: "unset", top: "0", right: "0", transform: "rotate(90deg)", fontSize: "14px", opacity: "1", zIndex: "3" }}>
                    <span style={{ position: "absolute", top: "20px", right: "-37px", transform: "rotate(-45deg)", backgroundColor: "var(--p-color-bg-fill-success)", display: "block", width: "200px", padding: "10px 0", lineHeight: "14px", boxShadow: "0 5px 10px rgba(0, 0, 0, .1)", textAlign: "center", textShadow: "0 1px 1px rgba(0, 0, 0, .2)", color: "#fff" }}>
                        {featuredText}
                    </span>
                </div>
            ) : null}
            <Card>
                <BlockStack gap="400">
                    <BlockStack gap="200" align="start">
                        <Text as="h3" variant="headingLg">
                            {title}
                        </Text>
                        {description ? (
                            <Text as="p" variant="bodySm" tone="subdued">
                                {description}
                            </Text>
                        ) : null}
                    </BlockStack>

                    <div style={{ display: 'flex', alignItems: 'end', gap: '8px' }}>
                        <Text as="h2" variant="heading2xl">
                            {price}
                        </Text>
                        <Box paddingBlockEnd="200">
                            <Text as="span" variant="bodySm">/ {frequency}</Text>
                        </Box>
                    </div>

                    <BlockStack gap="100">
                        {features?.map((feature, id) => (
                            <InlineStack key={id} align="start" gap="200" wrap={false}>
                                <div style={{ margin: 0, backgroundColor: 'var(--p-color-bg)', borderRadius: 'var(--p-border-radius-full)' }}>
                                    <Icon
                                        source={CheckIcon}
                                        tone="success"
                                    />
                                </div>
                                <Text tone="subdued" as="p" variant="bodyMd" key={id}>
                                    {feature}
                                </Text>
                            </InlineStack>
                        ))}
                    </BlockStack>

                    <Box paddingBlockStart="200" paddingBlockEnd="200">
                        <ButtonGroup fullWidth>
                            <Button {...button.props}>{button.content}</Button>
                        </ButtonGroup>
                    </Box>
                </BlockStack>
            </Card>
        </div>
    );
};

function Pricing() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    return (
        <Page
            title="Pricing"
            
        >
            <Layout>
                {/* Banner */}
                {isBannerVisible && (
                    <Layout.Section>
                        <Banner onDismiss={() => setIsBannerVisible(false)}>
                            <p>
                                Use your finance report to get detailed information about your business.{' '}
                                <Link url="">Let us know what you think</Link>
                            </p>
                        </Banner>
                    </Layout.Section>
                )}

                {/* Pricing Cards */}
                <Layout.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <PricingCard
                                title="Standard"
                                description="This is a great plan for stores that are just starting out"
                                features={[
                                    "Process up to 1,000 orders/mo",
                                    "Amazing feature",
                                    "Another really cool feature",
                                    "24/7 Customer Support",
                                    "Free Setup Guide",
                                    "Free 100% Money Back Guarantee",
                                    "Free 30 Day Trial",
                                    "Free 100% Money Back Guarantee",
                                    "Free 100% Money Back Guarantee",
                                ]}
                                price="$19"
                                frequency="month"
                                button={{
                                    content: "Select Plan",
                                    props: {
                                        variant: "primary",
                                        onClick: () => console.log("clicked plan!"),
                                    },
                                }}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <PricingCard
                                title="Advanced"
                                featuredText="Most Popular"
                                description="For stores that are growing and need a reliable solution to scale with them"
                                features={[
                                    "Process up to 10,000 orders/mo",
                                    "Amazing feature",
                                    "Another really cool feature",
                                    "24/7 Customer Support",
                                    "Free Setup Guide",
                                    "Free 100% Money Back Guarantee",
                                    "Free 30 Day Trial",
                                    "Free 100% Money Back Guarantee",
                                    "Free 100% Money Back Guarantee",
                                ]}
                                price="$49"
                                frequency="month"
                                button={{
                                    content: "Select Plan",
                                    props: {
                                        variant: "primary",
                                        onClick: () => console.log("clicked plan!"),
                                    },
                                }}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <PricingCard
                                title="Premium"
                                description="The best of the best, for stores that have the highest order processing needs"
                                features={[
                                    "Process up to 100,000 orders/mo",
                                    "Amazing feature",
                                    "Another really cool feature",
                                    "24/7 Customer Support",
                                    "Free Setup Guide",
                                    "Free 100% Money Back Guarantee",
                                    "Free 30 Day Trial",
                                    "Free 100% Money Back Guarantee",
                                    "Free 100% Money Back Guarantee",
                                ]}
                                price="$99"
                                frequency="month"
                                button={{
                                    content: "Select Plan",
                                    props: {
                                        variant: "primary",
                                        onClick: () => console.log("clicked plan!"),
                                    },
                                }}
                            />
                        </Grid.Cell>
                    </Grid>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Pricing;