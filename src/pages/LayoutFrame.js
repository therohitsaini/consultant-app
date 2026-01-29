import {
    Frame,
    TopBar,
    Toast,
    Modal,
    TextField,
    FormLayout,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { AdminMenu } from "./AdminMenu";

export default function LayoutFrame() {
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [adminIdLocal, setAdminIdLocal] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const adminId = params.get("adminId");

    useEffect(() => {
        if (adminId) {
            localStorage.setItem("domain_V_id", adminId);
            setAdminIdLocal(adminId);
        }
    }, [adminId]);

    const toggleMobileNav = useCallback(
        () => setMobileNavActive((v) => !v),
        []
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            onNavigationToggle={toggleMobileNav}
        />
    );

    return (
        <Fragment>
            {/* // <Frame topBar={topBarMarkup}> */}
            {/* 🔥 Page Content */}
            <AdminMenu />

            <Outlet context={{ adminIdLocal }} />
            {/* <Footer /> */}

            {toastActive && (
                <Toast
                    content="Saved successfully"
                    onDismiss={() => setToastActive(false)}
                />
            )}

            <Modal
                open={modalActive}
                onClose={() => setModalActive(false)}
                title="Contact support"
                primaryAction={{
                    content: "Send",
                    onAction: () => setModalActive(false),
                }}
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
        </Fragment>
    );
}
