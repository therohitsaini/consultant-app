import { Banner, Layout, Page, BlockStack, LegacyCard, FormLayout, TextField, Tag, LegacyStack, Text, Select, Button, Spinner } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import axios from 'axios';



function AddConsultant() {
    // Banner
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Single state object for all form fields
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        profession: '',
        specialization: '',
        licenseIdNumber: '',
        yearOfExperience: '',
        chargingPerMinute: '',
        languages: [],
        displayName: '',
        gender: 'male',
        houseNumber: '',
        streetArea: '',
        landmark: '',
        address: '',
        pincode: '',
        dateOfBirth: '',
        pancardNumber: '',
    });

    // Language tags
    const availableTags = ['English', 'French', 'Hindi', 'Japanese', 'Russian', 'Shona', 'Sesotho', 'Spanish', 'Tajik'];
    const [textFieldValue, setTextFieldValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Generic handler for form field changes
    const handleFieldChange = useCallback((fieldName) => {
        return (value) => {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: value,
            }));
        };
    }, []);

    // Language tag handlers
    const handleTextFieldChange = useCallback(
        (value) => {
            setTextFieldValue(value);
            setShowDropdown(true);
        },
        [],
    );

    const handleTextFieldFocus = useCallback(() => {
        setShowDropdown(true);
    }, []);

    const handleTagSelect = useCallback((tag) => {
        if (!formData.languages.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, tag],
            }));
        }
        setTextFieldValue('');
        setShowDropdown(false);
    }, [formData.languages]);

    const handleRemoveTag = useCallback((tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter((tag) => tag !== tagToRemove),
        }));
    }, []);

    // Filter tags based on search input
    const filteredTags = availableTags.filter((tag) => {
        const matchesSearch = textFieldValue.length === 0 || tag.toLowerCase().includes(textFieldValue.toLowerCase());
        const notSelected = !formData.languages.includes(tag);
        return matchesSearch && notSelected;
    });

    const verticalContentMarkup = (
        <BlockStack gap="200">
            {formData.languages.length > 0 && (
                <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" fontWeight="medium">Selected Tags:</Text>
                    <LegacyStack spacing="extraTight" alignment="center" wrap>
                        {formData.languages.map((tag) => (
                            <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                                {tag}
                            </Tag>
                        ))}
                    </LegacyStack>
                </BlockStack>
            )}
        </BlockStack>
    );

    const dropdownMarkup = showDropdown && filteredTags.length > 0 && (
        <div
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e1e3e5',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '4px',
            }}
        >
            {filteredTags.map((tag) => (
                <div
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e1e3e5',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f6f6f7';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                    }}
                >
                    <Text variant="bodyMd">{tag}</Text>
                </div>
            ))}
        </div>
    );



    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    console.log(formData);
    // POST API function to submit form data
    const submitConsultantData = useCallback(async () => {
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const response = await fetch('http://localhost:5001/api-consultant/add-consultant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(formData),
                // body: formData,
                body: JSON.stringify(formData),
            });
            console.log(formData);
            if (response.ok) {
                setSubmitSuccess(true);
                setTextFieldValue('');
                setFormData({});
            }
            else {
                setSubmitError('Failed to submit consultant data. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting consultant data:', error);
            setSubmitError(
                error.response?.data?.message ||
                error.message ||
                'Failed to submit consultant data. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData]);


    return (
        <Page
            backAction={{ content: 'Consultant List', url: '/consultant-list' }}
            title="Add Consultant settings"
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

                {/* Add Consultant settings */}
                <Layout.Section>
                    <LegacyCard title="Add Consultant settings" sectioned>
                        <FormLayout>
                            <FormLayout.Group>
                                {/* Full Name */}
                                <TextField
                                    label="Full Name"
                                    value={formData.fullName}
                                    onChange={handleFieldChange('fullName')}
                                    autoComplete="off"
                                />

                                {/* Email */}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFieldChange('email')}
                                    autoComplete="email"
                                />

                                {/* Password */}
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleFieldChange('password')}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* Phone Number */}
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleFieldChange('phoneNumber')}
                                    autoComplete="off"
                                />

                                {/* Profession */}
                                <TextField
                                    label="Profession"
                                    value={formData.profession}
                                    onChange={handleFieldChange('profession')}
                                    autoComplete="off"
                                />

                                {/* Specialization */}
                                <TextField
                                    label="Specialization"
                                    value={formData.specialization}
                                    onChange={handleFieldChange('specialization')}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* License / ID Number */}
                                <TextField
                                    label="License / ID Number"
                                    value={formData.licenseIdNumber}
                                    onChange={handleFieldChange('licenseIdNumber')}
                                    autoComplete="off"
                                />

                                {/* Year of Experience */}
                                <TextField
                                    label="Year of Experience"
                                    value={formData.yearOfExperience}
                                    onChange={handleFieldChange('yearOfExperience')}
                                    autoComplete="off"
                                />

                                {/* Charging per minute */}
                                <TextField
                                    label="Charging par minute"
                                    value={formData.chargingPerMinute}
                                    onChange={handleFieldChange('chargingPerMinute')}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>

                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>

                {/* add your consultant Language */}
                <Layout.Section>
                    <LegacyCard title="Add your consultant Language" sectioned>
                        <FormLayout>
                            <FormLayout.Group>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <TextField
                                        label="Tags"
                                        value={textFieldValue}
                                        onChange={handleTextFieldChange}
                                        onFocus={handleTextFieldFocus}
                                        onBlur={() => {
                                            // Delay to allow click event on dropdown items
                                            setTimeout(() => setShowDropdown(false), 200);
                                        }}
                                        placeholder="Search tags"
                                        autoComplete="off"
                                        verticalContent={verticalContentMarkup}
                                    />
                                    {dropdownMarkup}
                                </div>
                            </FormLayout.Group>
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>

                {/* Add your consultant details */}
                <Layout.Section>
                    <LegacyCard title="Add your consultant details" sectioned>
                        <FormLayout>
                            <FormLayout.Group>
                                {/* Display Name */}
                                <TextField
                                    label="Display Name"
                                    value={formData.displayName}
                                    onChange={handleFieldChange('displayName')}
                                    autoComplete="off"
                                />
                                {/* Gender */}
                                <Select
                                    label="Gender"
                                    options={genderOptions}
                                    onChange={handleFieldChange('gender')}
                                    value={formData.gender}
                                />

                                {/* House Number */}
                                <TextField
                                    label="House Number"
                                    value={formData.houseNumber}
                                    onChange={handleFieldChange('houseNumber')}
                                    autoComplete="off"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* Street Area */}
                                <TextField
                                    label="Street Area"
                                    value={formData.streetArea}
                                    onChange={handleFieldChange('streetArea')}
                                    autoComplete="off"
                                />

                                {/* Landmark */}
                                <TextField
                                    label="Landmark"
                                    value={formData.landmark}
                                    onChange={handleFieldChange('landmark')}
                                    autoComplete="off"
                                />

                                {/* Address */}
                                <TextField
                                    label="Address"
                                    value={formData.address}
                                    onChange={handleFieldChange('address')}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* Pincode */}
                                <TextField
                                    label="Pincode"
                                    value={formData.pincode}
                                    type="number"
                                    onChange={handleFieldChange('pincode')}
                                    autoComplete="off"
                                />

                                {/* Date of Birth */}
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleFieldChange('dateOfBirth')}
                                    autoComplete="off"
                                />

                                {/* Pancard Number */}
                                <TextField
                                    label="Pancard Number"
                                    value={formData.pancardNumber}
                                    onChange={handleFieldChange('pancardNumber')}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                        </FormLayout>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <Button
                                primary
                                onClick={submitConsultantData}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                        {submitError && (
                            <div style={{ marginTop: '16px' }}>
                                <Banner tone="critical" onDismiss={() => setSubmitError('')}>
                                    <p>{submitError}</p>
                                </Banner>
                            </div>
                        )}
                        {submitSuccess && (
                            <div style={{ marginTop: '16px' }}>
                                <Banner tone="success" onDismiss={() => setSubmitSuccess(false)}>
                                    <p>Consultant added successfully!</p>
                                </Banner>
                            </div>
                        )}
                    </LegacyCard>
                </Layout.Section>

            </Layout>
        </Page >
    );
}

export default AddConsultant;