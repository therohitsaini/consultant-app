import { Banner, Layout, Page, BlockStack, LegacyCard, FormLayout, TextField, Tag, DropZone, LegacyStack, Text, Select, Button, Spinner, Grid } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { availableTags, genderOptions } from '../components/FallbackData/FallbackData';
import { useSearchParams } from 'react-router-dom';



function AddConsultant() {
    // Banner
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [consultantDetails, setConsultantDetails] = useState(null)
    const [updateIsTrue, setUpdateIsTrue] = useState(false);
    const fileInputRef = useRef(null);



    // Single state object for all form fields
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        profession: '',
        profileImage: '',
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
    const [textFieldValue, setTextFieldValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    console.log("formData,", formData)
    const [searchParams] = useSearchParams();
    const consultantId = searchParams.get('id');
    const params = new URLSearchParams(window.location.search);
    const adminId = params.get('adminId');
    console.log("adminId", adminId);

    useEffect(() => {
        if (consultantId) {
            setUpdateIsTrue(true);
        }
    }, [consultantId]);
    console.log("consultantDetails", consultantDetails)

    const handleFieldChange = useCallback((fieldName) => {
        return (value) => {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: value,
            }));
        };
    }, []);

    const handleFileInputChange = useCallback(
        (event) => {
            const file = event.target.files?.[0];
            if (file) {
                setProfileImageUrl(URL.createObjectURL(file));
                setProfileFile(file);
            }
        },
        [],
    );
    const handleDropZoneDrop = useCallback(
        (dropFiles, acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length > 0) {
                setProfileFile(acceptedFiles[0]);
            }
        },
        [],
    );

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


    const handleFileButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const submitConsultantData = useCallback(async () => {
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);
        const form = new FormData();

        if (profileFile) {
            form.append("profileImage", profileFile);
        }
        Object.keys(formData).forEach((key) => {
            const value = formData[key];
            if (value !== '' && value !== null && value !== undefined && key !== 'profileImage') {
                if (Array.isArray(value)) {
                    form.append(key, JSON.stringify(value));
                } else {
                    form.append(key, value);
                }
            }
        });

        for (let pair of form.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/add-consultant/${"690c374f605cb8b946503ccb"}`, {
                method: 'POST',
                body: form,
            });

            const responseData = await response.json();
            console.log("responseData", responseData);
            if (response.ok) {
                setSubmitSuccess(true);
                setTextFieldValue('');
                setProfileFile(null);
                setProfileImageUrl(null);
            } else {
                setSubmitError(responseData?.message || 'Failed to submit consultant data. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting consultant data:', error);
            setSubmitError(
                error.message || 'Failed to submit consultant data. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, profileFile]);

    const getConsultantById = async () => {
        if (!consultantId) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/consultantid/${consultantId}`);
            const data = await response.json();
            console.log("responseData", data);

            if (response.ok && data.consultant) {
                setConsultantDetails(data.consultant);
            }
        } catch (error) {
            console.error('Error fetching consultant:', error);
        }
    }

    useEffect(() => {
        if (consultantId) {
            getConsultantById();
        }
    }, [consultantId]);


    useEffect(() => {
        if (consultantDetails && consultantDetails.email) {
            // Format dateOfBirth if it's a Date object or ISO string
            let formattedDateOfBirth = '';
            if (consultantDetails.dateOfBirth) {
                const date = new Date(consultantDetails.dateOfBirth);
                if (!isNaN(date.getTime())) {
                    // Format as YYYY-MM-DD for input field
                    formattedDateOfBirth = date.toISOString().split('T')[0];
                } else {
                    formattedDateOfBirth = consultantDetails.dateOfBirth;
                }
            }

            // Populate formData when consultantDetails is loaded
            setFormData({
                fullName: consultantDetails.fullname || consultantDetails.fullName || '',
                email: consultantDetails.email || '',
                password: consultantDetails.password || '',
                phoneNumber: consultantDetails.phone || consultantDetails.phoneNumber || consultantDetails.contact || '',
                profession: consultantDetails.profession || '',
                profileImage: consultantDetails.profileImage || '',
                specialization: consultantDetails.specialization || '',
                licenseIdNumber: consultantDetails.licenseNo || consultantDetails.licenseIdNumber || '',
                yearOfExperience: consultantDetails.experience || consultantDetails.yearOfExperience || '',
                chargingPerMinute: consultantDetails.fees || consultantDetails.chargingPerMinute || '',
                languages: Array.isArray(consultantDetails.language)
                    ? consultantDetails.language
                    : Array.isArray(consultantDetails.languages)
                        ? consultantDetails.languages
                        : [],
                displayName: consultantDetails.displayName || '',
                gender: consultantDetails.gender || 'male',
                houseNumber: consultantDetails.houseNumber || '',
                streetArea: consultantDetails.streetArea || '',
                landmark: consultantDetails.landmark || '',
                address: consultantDetails.address || '',
                pincode: consultantDetails.pincode || '',
                dateOfBirth: formattedDateOfBirth,
                pancardNumber: consultantDetails.pan_cardNumber || consultantDetails.pancardNumber || '',
            });

            // Set profile image preview if available
            if (consultantDetails.profileImage) {
                // Convert Windows path (backslashes) to forward slashes
                let imagePath = consultantDetails.profileImage.replace(/\\/g, "/");

                // If path doesn't start with http, prepend backend host URL
                if (!imagePath.startsWith('http')) {
                    const backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:5001';
                    // Remove trailing slash from backend host if present
                    const baseUrl = backendHost.replace(/\/$/, '');
                    // Remove leading slash from image path if present
                    imagePath = imagePath.replace(/^\//, '');
                    imagePath = `${baseUrl}/${imagePath}`;
                }

                console.log('Profile image URL:', imagePath);
                setProfileImageUrl(imagePath);
                setProfileImagePreview(imagePath);
            }
        }
    }, [consultantDetails])

    return (
        <Page
            backAction={{ content: 'Consultant List', url: '/consultant-list' }}
            title={updateIsTrue ? 'Update Consultant settings' : 'Add Consultant settings'}
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
                            title="Hi Admin. Welcome To: Your Shopify Store"
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
                                <Grid>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                        <FormLayout>
                                            <FormLayout.Group>
                                                {/* Full Name */}
                                                <TextField
                                                    label="Full Name"
                                                    value={formData.fullName}
                                                    onChange={handleFieldChange('fullName')}
                                                    autoComplete="off"
                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group>
                                                {/* Email */}
                                                <TextField
                                                    label="Email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleFieldChange('email')}
                                                    autoComplete="email"
                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group>
                                                {/* Password */}
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleFieldChange('password')}
                                                    autoComplete="off"
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </Grid.Cell>
                                    {/* Profile Image */}
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>

                                        <div style={{ width: 200, height: 'auto', margin: 'auto', }}>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none', }}
                                            />
                                            <DropZone
                                                onDrop={handleDropZoneDrop}
                                                accept="image/*"
                                                type="image"
                                                allowMultiple={false}
                                            >
                                                {profileImageUrl ? (
                                                    <div style={{ width: '100%', height: '100%', textAlign: 'center', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img
                                                            src={profileImageUrl || './images/teamdefault.png'}
                                                            alt="Profile Preview"
                                                            style={{
                                                                width: 90,
                                                                height: 90,
                                                                borderRadius: '8px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', textAlign: 'center', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img
                                                            src="./images\flag\teamdefault.png"
                                                            alt="Default Profile"
                                                            style={{
                                                                width: 90,
                                                                height: 90,
                                                                borderRadius: '8px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </DropZone>
                                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                                <Button size="slim" onClick={handleFileButtonClick}>
                                                    Upload Image
                                                </Button>
                                            </div>
                                        </div>
                                    </Grid.Cell>
                                </Grid>
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
                    <div className="language-card-wrapper">
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
                    </div>
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