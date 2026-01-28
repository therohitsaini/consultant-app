import React, { useState, useCallback } from 'react';
import {
    Page,
    Layout,
    LegacyCard,
    FormLayout,
    TextField,
    Button,
    Banner,
    BlockStack,
} from '@shopify/polaris';
import axios from 'axios';
import { useAppBridge } from '../components/createContext/AppBridgeContext';
import { useMemo } from 'react';
import { Redirect } from '@shopify/app-bridge/actions';

function VoucherSettings() {
    const app = useAppBridge();
    const redirect = useMemo(() => {
        if (!app) return null;
        return Redirect.create(app);
    }, [app]);
    const backToVoucherManagement = () => {
        if (!redirect) return;
        redirect.dispatch(Redirect.Action.APP, '/admin-settings/voucher-management');
    }
    const [formData, setFormData] = useState({
        totalCoin: '',
        extraCoin: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [existingData, setExistingData] = useState(null);

    // Get adminId from URL params
    const params = new URLSearchParams(window.location.search);
    const adminId = params.get('adminId') 
    console.log("adminId____VoucherSettings", adminId)
    

    const handleFieldChange = useCallback((fieldName) => {
        return (value) => {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: value,
            }));
            // Clear errors when user starts typing
            if (submitError) {
                setSubmitError('');
            }
            if (submitSuccess) {
                setSubmitSuccess(false);
            }
        };
    }, [submitError, submitSuccess]);

    const validateForm = useCallback(() => {
        if (!formData.totalCoin || formData.totalCoin.trim() === '') {
            setSubmitError('Total Coin is required');
            return false;
        }
        if (isNaN(Number(formData.totalCoin)) || Number(formData.totalCoin) < 0) {
            setSubmitError('Total Coin must be a valid positive number');
            return false;
        }
        if (!formData.extraCoin || formData.extraCoin.trim() === '') {
            setSubmitError('Extra Coin is required');
            return false;
        }
        if (isNaN(Number(formData.extraCoin)) || Number(formData.extraCoin) < 0) {
            setSubmitError('Extra Coin must be a valid positive number');
            return false;
        }
        return true;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        const userId = localStorage.getItem("domain_V_id");
        console.log("userId____VoucherSettings", userId)
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const payload = {
                totalCoin: Number(formData.totalCoin),
                extraCoin: Number(formData.extraCoin),
            };

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_HOST}/api/admin/admin/voucher/${userId}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && (response.data.success || response.status === 200)) {
                setSubmitSuccess(true);
                setExistingData(payload);
              
            } else {
                setSubmitError(response.data?.message || 'Failed to save voucher settings. Please try again.');
            }
        } catch (error) {
            console.error('Error saving voucher settings:', error);
            setSubmitError(
                error.response?.data?.message ||
                error.message ||
                'Failed to save voucher settings. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, adminId, validateForm]);

    const handleDismissBanner = useCallback(() => {
        setSubmitSuccess(false);
        setSubmitError('');
    }, []);

    return (
        <Page
        backAction={{ content: 'Voucher Management', onAction: backToVoucherManagement }}
            title="Voucher Settings"
          
        >
            <Layout>
                <Layout.Section>
                    <BlockStack gap="400">
                        {submitSuccess && (
                            <Banner
                                title="Settings saved successfully"
                                status="success"
                                onDismiss={handleDismissBanner}
                            >
                                <p>Voucher settings have been saved successfully.</p>
                            </Banner>
                        )}

                        {submitError && (
                            <Banner
                                title="Error saving settings"
                                status="critical"
                                onDismiss={handleDismissBanner}
                            >
                                <p>{submitError}</p>
                            </Banner>
                        )}

                        <LegacyCard sectioned title="Dynamic Card Coin Settings">
                            <FormLayout>
                                <TextField
                                    label="Total Coin"
                                    type="number"
                                    value={formData.totalCoin}
                                    onChange={handleFieldChange('totalCoin')}
                                    placeholder="Enter total coin amount"
                                    helpText="Set the total coin amount for dynamic cards"
                                    autoComplete="off"
                                    min={0}
                                    step="1"
                                />

                                <TextField
                                    label="Extra Coin"
                                    type="number"
                                    value={formData.extraCoin}
                                    onChange={handleFieldChange('extraCoin')}
                                    placeholder="Enter extra coin amount"
                                    helpText="Set the extra coin amount for dynamic cards"
                                    autoComplete="off"
                                    min={0}
                                    step="1"
                                />

                                <div style={{ marginTop: '1rem' }}>
                                    <Button
                                        primary
                                        onClick={handleSubmit}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                    >
                                        {existingData ? 'Update Settings' : 'Save '}
                                    </Button>
                                </div>
                            </FormLayout>
                        </LegacyCard>

                        {existingData && (
                            <LegacyCard sectioned title="Current Settings">
                                <BlockStack gap="200">
                                    <p>
                                        <strong>Total Coin:</strong> {existingData.totalCoin || formData.totalCoin}
                                    </p>
                                    <p>
                                        <strong>Extra Coin:</strong> {existingData.extraCoin || formData.extraCoin}
                                    </p>
                                </BlockStack>
                            </LegacyCard>
                        )}
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default VoucherSettings;

