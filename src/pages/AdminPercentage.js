import {
    Card,
    TextField,
    Button,
    Form,
    FormLayout,
    Toast,
    Page,
    Layout,
    LegacyCard,
    ContextualSaveBar
} from "@shopify/polaris";
import { useState, useCallback, Fragment } from "react";
import axios from "axios";
import { fetchAdminDetails } from "../components/Redux/slices/adminSlice";

function AdminPercentage({ currentPercentage }) {

    const [adminDetails, setAdminDetails] = useState(null);
    const [percentage, setPercentage] = useState(
        currentPercentage?.toString() || ""
    );
    const [loading, setLoading] = useState(false);
    const [toastActive, setToastActive] = useState(false);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        const adminIdLocal = localStorage.getItem('domain_V_id');
        dispatch(fetchAdminDetails({ adminIdLocal, app }));
        setAdminDetails(adminDetails);
    }, []);

    const handleChange = useCallback((value) => {
        setPercentage(value);
    }, []);

    const toggleToast = useCallback(() => {
        setToastActive((active) => !active);
    }, []);

    const handleSubmit = async () => {
        if (!percentage || percentage < 0 || percentage > 100) {
            alert("Please enter a valid percentage (0–100)");
            return;
        }

        try {
            setLoading(true);

            await axios.put(
                `${process.env.REACT_APP_BACKEND_HOST}/api-admin/update-percentage`,
                {
                    adminPercentage: Number(percentage),
                }
            );

            setToastActive(true);
        } catch (error) {
            alert("Failed to update percentage");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            {dirty && (
                <ContextualSaveBar
                    message="Unsaved changes"
                    saveAction={{
                        content: 'save',
                        onAction: handleSubmit,
                        loading: loading,
                    }}
                    discardAction={{
                        onAction: () => setDirty(false),
                    }}
                />
            )}


            <Page
                backAction={{ content: 'Back', onAction: () => navigate('/') }}
                title=" Admin Percentage" > <Layout> <Layout.Section>
                    <LegacyCard title=" Admin Percentage" sectioned>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <TextField
                                    label="Admin Percentage (%)"
                                    type="number"
                                    value={percentage}
                                    onChange={handleChange}
                                    min={0}
                                    max={100}
                                    autoComplete="off"
                                    helpText="Enter value between 0 and 100"
                                    onBlur={() => setDirty(true)}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="primary"
                                        submit
                                        loading={loading}
                                        onClick={() => setDirty(true)}
                                    >
                                        save
                                    </Button>
                                </div>
                            </FormLayout>
                        </Form>
                    </LegacyCard>
                </Layout.Section> </Layout> </Page>

        </Fragment>
    );
}

export default AdminPercentage;
