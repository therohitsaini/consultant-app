import { Banner, Layout, Page, BlockStack, LegacyCard, FormLayout, TextField, Tag, LegacyStack, Text, Select } from '@shopify/polaris';
import { ConfettiIcon, ExternalIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';



function AddConsultant() {
    // Banner
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    // Full Name
    const [fullName, setFullName] = useState('');

    const handleFullNameChange = useCallback(
        (newValue) => setFullName(newValue),
        [],
    );

    // Email
    const [email, setEmail] = useState('');

    const handleEmailChange = useCallback(
        (newValue) => setEmail(newValue),
        [],
    );

    // Password
    const [password, setPassword] = useState('');

    const handlePasswordChange = useCallback(
        (newValue) => setPassword(newValue),
        [],
    );

    // Phone Number
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneNumberChange = useCallback(
        (newValue) => setPhoneNumber(newValue),
        [],
    );

    // Profession
    const [profession, setProfession] = useState('');

    const handleProfessionChange = useCallback(
        (newValue) => setProfession(newValue),
        [],
    );

    // Specialization
    const [specialization, setSpecialization] = useState('');

    const handleSpecializationChange = useCallback(
        (newValue) => setSpecialization(newValue),
        [],
    );

    // License / ID Number
    const [licenseIdNumber, setLicenseIdNumber] = useState('');

    const handleLicenseIdNumberChange = useCallback(
        (newValue) => setLicenseIdNumber(newValue),
        [],
    );

    // Year of Experience
    const [yearOfExperience, setYearOfExperience] = useState('');

    const handleYearOfExperienceChange = useCallback(
        (newValue) => setYearOfExperience(newValue),
        [],
    );


    // Charging per minute
    const [chargingPerMinute, setChargingPerMinute] = useState('');

    const handleChargingPerMinuteChange = useCallback(
        (newValue) => setChargingPerMinute(newValue),
        [],
    );


    // add your consultant language

    const availableTags = ['English', 'French', 'Hindi', 'Japanese', 'Russian', 'Shona', 'Sesotho', 'Spanish', 'Tajik'];
    const [textFieldValue, setTextFieldValue] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

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
        if (!selectedTags.includes(tag)) {
            setSelectedTags((prev) => [...prev, tag]);
        }
        setTextFieldValue('');
        setShowDropdown(false);
    }, [selectedTags]);

    const handleRemoveTag = useCallback((tagToRemove) => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    }, []);

    // Filter tags based on search input
    const filteredTags = availableTags.filter((tag) => {
        const matchesSearch = textFieldValue.length === 0 || tag.toLowerCase().includes(textFieldValue.toLowerCase());
        const notSelected = !selectedTags.includes(tag);
        return matchesSearch && notSelected;
    });

    const verticalContentMarkup = (
        <BlockStack gap="200">
            {selectedTags.length > 0 && (
                <BlockStack gap="100">
                    <Text variant="bodySm" tone="subdued" fontWeight="medium">Selected Tags:</Text>
                    <LegacyStack spacing="extraTight" alignment="center" wrap>
                        {selectedTags.map((tag) => (
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


    // Display Name
    const [displayName, setDisplayName] = useState('');
    const handleDisplayNameChange = useCallback(
        (newValue) => setDisplayName(newValue),
        [],
    );


    // Gender
    const [selectedGender, setSelectedGender] = useState('male');

    const handleGenderChange = useCallback(
        (value) => setSelectedGender(value),
        [],
    );

    const options = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];


    // House Number
    const [houseNumber, setHouseNumber] = useState('');
    const handleHouseNumberChange = useCallback(
        (newValue) => setHouseNumber(newValue),
        [],
    );

    // Street Area
    const [streetArea, setStreetArea] = useState('');
    const handleStreetAreaChange = useCallback(
        (newValue) => setStreetArea(newValue),
        [],
    );

    // Landmark
    const [landmark, setLandmark] = useState('');
    const handleLandmarkChange = useCallback(
        (newValue) => setLandmark(newValue),
        [],
    );

    // Address
    const [address, setAddress] = useState('');
    const handleAddressChange = useCallback(
        (newValue) => setAddress(newValue),
        [],
    );

    // Pincode
    const [pincode, setPincode] = useState('');
    const handlePincodeChange = useCallback(
        (newValue) => setPincode(newValue),
        [],
    );

    // Date of Birth
    const [dateOfBirth, setDateOfBirth] = useState('');
    const handleDateOfBirthChange = useCallback(
        (newValue) => setDateOfBirth(newValue),
        [],
    );

    // Pancard Number
    const [pancardNumber, setPancardNumber] = useState('');
    const handlePancardNumberChange = useCallback(
        (newValue) => setPancardNumber(newValue),
        [],
    );


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
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    autoComplete="off"
                                />

                                {/* Email */}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    autoComplete="email"
                                />

                                {/* Password */}
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* Phone Number */}
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    autoComplete="off"
                                />

                                {/* Profession */}
                                <TextField
                                    label="Profession"
                                    value={profession}
                                    onChange={handleProfessionChange}
                                    autoComplete="off"
                                />

                                {/* Specialization */}
                                <TextField
                                    label="Specialization"
                                    value={specialization}
                                    onChange={handleSpecializationChange}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* License / ID Number */}
                                <TextField
                                    label="License / ID Number"
                                    value={licenseIdNumber}
                                    onChange={handleLicenseIdNumberChange}
                                    autoComplete="off"
                                />

                                {/* Year of Experience */}
                                <TextField
                                    label="Year of Experience"
                                    value={yearOfExperience}
                                    onChange={handleYearOfExperienceChange}
                                    autoComplete="off"
                                />

                                {/* Charging per minute */}
                                <TextField
                                    label="Charging par minute"
                                    value={chargingPerMinute}
                                    onChange={handleChargingPerMinuteChange}
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
                                    value={displayName}
                                    onChange={handleDisplayNameChange}
                                    autoComplete="off"
                                />
                                {/* Gender */}
                                <Select
                                    label="Gender"
                                    options={options}
                                    onChange={handleGenderChange}
                                    value={selectedGender}
                                />

                                {/* House Number */}
                                <TextField
                                    label="House Number"
                                    value={houseNumber}
                                    onChange={handleHouseNumberChange}
                                    autoComplete="off"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* House Number */}
                                <TextField
                                    label="Street Area"
                                    value={streetArea}
                                    onChange={handleStreetAreaChange}
                                    autoComplete="off"
                                />

                                {/* Landmark */}
                                <TextField
                                    label="Landmark"
                                    value={landmark}
                                    onChange={handleLandmarkChange}
                                    autoComplete="off"
                                />

                                {/* Address */}
                                <TextField
                                    label="Address"
                                    value={address}
                                    onChange={handleAddressChange}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                            <FormLayout.Group>

                                {/* Pincode */}
                                <TextField
                                    label="Pincode"
                                    value={pincode}
                                    type="number"
                                    onChange={handlePincodeChange}
                                    autoComplete="off"
                                />

                                {/* Date of Birth */}
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={handleDateOfBirthChange}
                                    autoComplete="off"
                                />

                                {/* Pancard Number */}
                                <TextField
                                    label="Pancard Number"
                                    value={pancardNumber}
                                    onChange={handlePancardNumberChange}
                                    autoComplete="off"
                                />

                            </FormLayout.Group>
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>

            </Layout>
        </Page >
    );
}

export default AddConsultant;