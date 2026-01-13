import {
    Frame,
    Navigation,
    TopBar,
    Toast,
    Modal,
    TextField,
    FormLayout,
} from "@shopify/polaris";

import {
    ArrowLeftIcon,
    HomeIcon,
    CashDollarIcon,
    QuestionCircleIcon,
    ListBulletedIcon,
    SettingsIcon,
} from "@shopify/polaris-icons";

import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Footer from "./Footer";
import AdminMenu from "./AdminMenu";

export default function LayoutFrame() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");
    const adminId = params.get("adminId");
    console.log("adminId", adminId);
    useEffect(() => {
        if (adminId) {
         const id =   localStorage.setItem('doamin_V_id', adminId);
         setAdminIdLocal(id);
         console.log("id", id);
        }
    }, [adminId]);
    console.log("adminIdLocal", adminIdLocal);
    const toggleMobileNav = useCallback(
        () => setMobileNavActive((v) => !v),
        []
    );

    const navigationMarkup = (
        <Navigation location={location.pathname}>
            <Navigation.Section
                items={[
                    {
                        label: "Back to Shopify",
                        icon: ArrowLeftIcon,
                    },
                ]}
            />

            <Navigation.Section
                title="Consultant App"
                items={[
                    {
                        label: "Dashboard",
                        icon: HomeIcon,
                        selected: location.pathname === "/dashboard",
                        onClick: () => navigate("/dashboard"),
                    },
                    {
                        label: "Consultant List",
                        icon: ListBulletedIcon,
                        selected: location.pathname === "/consultant-list",
                        onClick: () => navigate("/consultant-list"),
                    },
                    {
                        label: "Pricing",
                        icon: CashDollarIcon,
                        selected: location.pathname === "/pricing",
                        onClick: () => navigate("/pricing"),
                    },
                    {
                        label: "Admin Settings",
                        icon: SettingsIcon,
                        url: "/admin-settings",
                        selected: location.pathname.startsWith("/admin-settings"),
                        subNavigationItems: [
                            {
                                label: "Voucher Settings",
                                url: "/admin-settings/voucher",
                            },
                            {
                                label: "Permissions",
                                url: "/admin-settings/permissions",
                            },
                        ],
                    },

                    {
                        label: "FAQ",
                        icon: QuestionCircleIcon,
                        selected: location.pathname === "/faq",
                        onClick: () => navigate("/faq"),
                    },

                ]}
            />
        </Navigation>
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            onNavigationToggle={toggleMobileNav}
        />
    );

    return (
        <Frame
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            showMobileNavigation={mobileNavActive}
            onNavigationDismiss={toggleMobileNav}
        >
            {/* 🔥 PAGE CONTENT */}
            <Outlet adminIdLocal={adminIdLocal} />
            <AdminMenu />
            <Footer />

            {toastActive && (
                <Toast content="Saved successfully" onDismiss={() => setToastActive(false)} />
            )}

            <Modal
                open={modalActive}
                onClose={() => setModalActive(false)}
                title="Contact support"
                primaryAction={{ content: "Send", onAction: () => setModalActive(false) }}
            >
                <Modal.Section>
                    <FormLayout>
                        <TextField
                            label="Subject"
                            value={supportSubject}
                            onChange={setSupportSubject}
                        />
                        <TextField
                            label="Message"
                            value={supportMessage}
                            onChange={setSupportMessage}
                            multiline
                        />
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </Frame>
    );
}
