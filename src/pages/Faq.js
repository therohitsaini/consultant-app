import { Banner, Layout, Page, Card, Box, InlineStack, Text, Collapsible, BlockStack } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon, ChevronUpIcon, ChevronDownIcon } from '@shopify/polaris-icons';
import { useState } from 'react';


function Faq() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [expanded, setExpanded] = useState(0);
    const ACCORDION_ITEMS = [
        {
            id: 0,
            title: 'How can I change app status?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        Simply go to the <span className="Polaris-Text--bold">Dashboard</span> menu and click on the <span className="Polaris-Text--bold">App Status</span> button to Enable/Disable the consultant management system.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 1,
            title: 'How do I add a new consultant?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        Navigate to the <span className="Polaris-Text--bold">Consultant List</span> page and click on the <span className="Polaris-Text--bold">Add Consultant</span> button. Fill in all the required details including name, email, contact number, profession, years of experience, and conversion fees. Once you submit the form, the consultant will be added to your list.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 2,
            title: 'How do I manage consultant status (Active/Inactive)?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        You can easily toggle a consultant's status using the toggle switch in the <span className="Polaris-Text--bold">Status</span> column of the consultant table. Click the toggle to switch between Active and Inactive states. Active consultants are available for consultations, while inactive consultants are temporarily disabled.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 3,
            title: 'How do I filter consultants by consultation type?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        Use the filter tabs at the top of the consultant list: <span className="Polaris-Text--bold">All</span>, <span className="Polaris-Text--bold">Chat</span>, <span className="Polaris-Text--bold">Voice Call</span>, and <span className="Polaris-Text--bold">Video Call</span>. Click on any tab to view consultants filtered by their consultation type. You can also use the search bar to find consultants by name, email, contact, or profession.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 4,
            title: 'How do I edit consultant information?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        Click on the <span className="Polaris-Text--bold">Edit</span> icon in the Action column next to the consultant you want to modify. This will allow you to update their contact information, profession, experience, conversion fees, and consultation type. Save your changes to update the consultant's profile.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 5,
            title: 'How do I delete a consultant?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        Click on the <span className="Polaris-Text--bold">Delete</span> icon in the Action column next to the consultant you want to remove. Confirm the deletion when prompted. Please note that this action cannot be undone, and all consultation history for that consultant will be removed.
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 6,
            title: 'What information is displayed on the Dashboard?',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        
                    </Text>
                </BlockStack>
            )
        },
        {
            id: 7,
            title: 'How to set up store front ',
            content: (
                <BlockStack gap="300">
                    <Text variant='bodyMd' as='p'>
                        The Dashboard displays key metrics including: <span className="Polaris-Text--bold">Total Clients</span>, <span className="Polaris-Text--bold">Conversion Rate</span>, <span className="Polaris-Text--bold">Total Consultations</span>, and <span className="Polaris-Text--bold">Total Revenue</span>. These statistics help you track your consultant management performance and make informed decisions.
                    </Text>
                </BlockStack>
            )
        }
    ];


    return (
        <Page
            title="Faq"

        >
            <Layout>




                <Layout.Section>
                    <Card padding='0'>
                        {
                            ACCORDION_ITEMS.map(({ title, id, content }) => {
                                const isExpanded = expanded === id;
                                return (
                                    <Box
                                        borderBlockEndWidth='025'
                                        borderColor='border'
                                        background='bg-surface-secondary'
                                        key={id}
                                    >
                                        <Box paddingBlock='300' paddingInline='400'>
                                            <div
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    return setExpanded((prev) => (id === prev ? null : id));
                                                }}
                                            >
                                                <InlineStack align='space-between' blockAlign='center'>
                                                    <Text variant='headingMd' as='p'>
                                                        {title}
                                                    </Text>
                                                    {isExpanded ? (
                                                        <ChevronUpIcon width='1.5rem' height='1.5rem' />
                                                    ) : (
                                                        <ChevronDownIcon width='1.5rem' height='1.5rem' />
                                                    )}
                                                </InlineStack>
                                            </div>
                                        </Box>
                                        <Collapsible open={isExpanded} id={id.toString()}>
                                            <Box padding='400' background='bg-surface'>
                                                {content}
                                            </Box>
                                        </Collapsible>
                                    </Box>
                                );
                            })}
                    </Card>
                </Layout.Section>

            </Layout>
        </Page>
    );
}

export default Faq;