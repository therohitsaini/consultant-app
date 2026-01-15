import React, { Fragment } from 'react'
import IndexTableList from '../components/consultant-list/IndexTableList'
import { headings, itemStrings, sortOptions } from '../components/FallbackData/FallbackData'
import { Page, Layout, Banner, BlockStack } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'

function UserTransHistory() {
    return (
        <Fragment>
            <Page
                title="Recharge History"
                primaryAction={{
                    icon: PlusIcon,
                    content: 'Add Recharge',
                    url: '/add-recharge',
                }}
            >
                <Layout>

            

                    <Layout.Section>
                        <IndexTableList
                            itemStrings={itemStrings}
                            sortOptions={sortOptions}
                            data={[]}
                            headings={headings}
                            renderRow={() => {}}
                            resourceName={{ singular: 'recharge', plural: 'recharges' }}
                            queryPlaceholder="Search recharges"
                            onTabChange={() => {}}
                            onQueryChange={() => {}}
                            onSortChange={() => {}}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}

export default UserTransHistory