import {
    ActionList,
    LegacyCard,
    ContextualSaveBar,
    FormLayout,
    Frame,
    Layout,
    Loading,
    Modal,
    Navigation,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    TextContainer,
    TextField,
    Toast,
    TopBar,
} from '@shopify/polaris';
import {
    ArrowLeftIcon,
    HomeIcon,
    CashDollarIcon,
    ChatIcon,
    QuestionCircleIcon,
    EyeCheckMarkIcon,
    ListBulletedIcon,
} from '@shopify/polaris-icons';
import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Footer from './Footer';

function LayoutFrame({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultState = useRef({
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    });
    const skipToContentRef = useRef(null);

    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    const handleSubjectChange = useCallback(
        (value) => setSupportSubject(value),
        [],
    );
    const handleMessageChange = useCallback(
        (value) => setSupportMessage(value),
        [],
    );
    const handleDiscard = useCallback(() => {
        setEmailFieldValue(defaultState.current.emailFieldValue);
        setNameFieldValue(defaultState.current.nameFieldValue);
        setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
        defaultState.current.nameFieldValue = nameFieldValue;
        defaultState.current.emailFieldValue = emailFieldValue;

        setIsDirty(false);
        setToastActive(true);
        setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);
    const handleNameFieldChange = useCallback((value) => {
        setNameFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleSearchResultsDismiss = useCallback(() => {
        setSearchActive(false);
        setSearchValue('');
    }, []);
    const handleSearchFieldChange = useCallback((value) => {
        setSearchValue(value);
        setSearchActive(value.length > 0);
    }, []);
    const toggleToastActive = useCallback(
        () => setToastActive((toastActive) => !toastActive),
        [],
    );
    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        [],
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );
    const toggleIsLoading = useCallback(
        () => setIsLoading((isLoading) => !isLoading),
        [],
    );
    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        [],
    );

    const toastMarkup = toastActive ? (
        <Toast onDismiss={toggleToastActive} content="Changes saved" />
    ) : null;

    const userMenuActions = [
        {
            items: [{ content: 'Community forums' }],
        },
    ];

    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: handleSave,
            }}
            discardAction={{
                onAction: handleDiscard,
            }}
        />
    ) : null;

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name="Dharma"
            detail={storeName}
            initials="D"
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const searchResultsMarkup = (
        <ActionList
            items={[{ content: 'Shopify help center' }, { content: 'Community forums' }]}
        />
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchFieldChange}
            value={searchValue}
            placeholder="Search"
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={handleSearchResultsDismiss}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const handleNavigation = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const navigationMarkup = (
        <Navigation location={location.pathname}>
            <Navigation.Section
                items={[
                    {
                        label: 'Back to Shopify',
                        icon: ArrowLeftIcon,
                    },
                ]}
            />
            <Navigation.Section
                separator
                title="Quick View Maker App"
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeIcon,
                        url: '/dashboard',
                        selected: location.pathname === '/dashboard',
                        onClick: () => handleNavigation('/dashboard'),
                    },
                    {
                        label: 'Consultant List',
                        icon: ListBulletedIcon,
                        url: '/consultant-list',
                        selected: location.pathname === '/consultant-list',
                        onClick: () => handleNavigation('/consultant-list'),
                    },
                    {
                        label: 'Pricing',
                        icon: CashDollarIcon,
                        url: '/pricing',
                        selected: location.pathname === '/pricing',
                        onClick: () => handleNavigation('/pricing'),
                    },
                    {
                        label: 'Faq',
                        icon: QuestionCircleIcon,
                        url: '/faq',
                        selected: location.pathname === '/faq',
                        onClick: () => handleNavigation('/faq'),
                    },
                    {
                        label: 'Add Consultant',
                        icon: CashDollarIcon,
                        url: '/add-consultant2',
                        selected: location.pathname === '/add-consultant2',
                        onClick: () => handleNavigation('/add-consultant2'),
                    },
                ]}
                action={{
                    icon: ChatIcon,
                    accessibilityLabel: 'Contact support',
                    onClick: toggleModalActive,
                }}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
    );

    const actualPageMarkup = (
        <>
            {skipToContentTarget}
            {children || (
                <Dashboard />
            )}
            <Footer />
        </>
    );

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{
                content: 'Send',
                onAction: toggleModalActive,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Subject"
                        value={supportSubject}
                        onChange={handleSubjectChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Message"
                        value={supportMessage}
                        onChange={handleMessageChange}
                        autoComplete="off"
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 86,
        topBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        contextualSaveBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        accessibilityLabel: 'Shopify',
    };

    return (
        <div style={{ height: '500px' }}>
                <Frame
                    logo={logo}
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </div>
    );
}

export default LayoutFrame;