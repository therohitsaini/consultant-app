import React, { useState, useCallback, useContext, useEffect } from 'react';
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
import { ToastContext } from '../components/AlertModel/PolariesTostContext';
import { getAppBridgeToken } from '../utils/getAppBridgeToken';

function VoucherSettings() {
    const app = useAppBridge();
    const { showToast } = useContext(ToastContext);
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
    const [loading, setLoading] = useState(false);


    const params = new URLSearchParams(window.location.search);
    const adminId = params.get('adminId')
    const voucherId = params.get('id')
    const totalCoin = params.get('totalCoin')
    const extraCoin = params.get('extraCoin')
    const userId = localStorage.getItem("domain_V_id");


    useEffect(() => {
        if (totalCoin && extraCoin) {
            setFormData({
                totalCoin: totalCoin,
                extraCoin: extraCoin,
            });
        }
    }, [totalCoin, extraCoin])

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

        if (isNaN(Number(formData.extraCoin)) || Number(formData.extraCoin) < 0) {
            setSubmitError('Extra Coin must be a valid positive number');
            return false;
        }
        return true;
    }, [formData])

    const handleSubmit = useCallback(async () => {
        const token = await getAppBridgeToken(app);
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
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            if (response.status === 200) {
                showToast(response.data?.message || 'Voucher settings have been saved successfully.');
                backToVoucherManagement();
            } else {
                setSubmitError(response.data?.message || 'Failed to save voucher settings. Please try again.');
            }
            console.log("response____VoucherSettings", response)
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

    //-------------------------- update voucher settings -------------------

    const handleUpdate = async () => {
        const token = await getAppBridgeToken(app);
        setLoading(true);
        try {
            const payload = {
                totalCoin: Number(formData.totalCoin),
                extraCoin: Number(formData.extraCoin),
            };
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_HOST}/api/admin/admin/voucher-updates/${userId}/${voucherId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                showToast(response.data?.message || 'Voucher settings have been updated successfully.');
                backToVoucherManagement();
            } else {
                setSubmitError(response.data?.message || 'Failed to update voucher settings. Please try again.');
            }
        } catch (error) {
            console.error('Error updating voucher settings:', error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <Page
            backAction={{ content: 'Voucher Management', onAction: backToVoucherManagement }}
            title={voucherId ? 'Update Voucher Settings' : 'Voucher Management'}

        >
            <Layout>
                <Layout.Section>
                    <BlockStack gap="400">

                        <LegacyCard sectioned title="Dynamic Card Coin Management">
                            <FormLayout>
                                <TextField
                                    label="Coin"
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
                                    label="Gift Coin"
                                    type="number"
                                    value={formData.extraCoin}
                                    onChange={handleFieldChange('extraCoin')}
                                    placeholder="Enter extra coin amount"
                                    helpText="Set the gift coin amount for dynamic cards"
                                    autoComplete="off"
                                    min={0}
                                    step="1"
                                />

                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="primary"

                                        onClick={voucherId ? handleUpdate : handleSubmit}
                                        loading={loading}
                                        disabled={loading}
                                    >
                                        {voucherId ? 'Update Voucher' : 'Create Voucher'}
                                    </Button>
                                </div>
                            </FormLayout>
                        </LegacyCard>


                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default VoucherSettings;

