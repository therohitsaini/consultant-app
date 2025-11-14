import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  Text,
  Badge,
  useBreakpoints,
  ButtonGroup,
  Button,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { EditIcon, DuplicateIcon, DeleteIcon } from '@shopify/polaris-icons';
function IndexTableList() {
  const [itemStrings, setItemStrings] = useState([
    'All',
    'chat',
    'voice call',
    'video call',
  ]);
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { },
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));
  const [selected, setSelected] = useState(0);
  const sortOptions = [
    { label: 'Name', value: 'name asc', directionLabel: 'A-Z' },
    { label: 'Name', value: 'name desc', directionLabel: 'Z-A' },
    { label: 'Email Id', value: 'emailId asc', directionLabel: 'A-Z' },
    { label: 'Email Id', value: 'emailId desc', directionLabel: 'Z-A' },
    { label: 'Contact', value: 'contact asc', directionLabel: 'Ascending' },
    { label: 'Contact', value: 'contact desc', directionLabel: 'Descending' },
    { label: 'Profession', value: 'profession asc', directionLabel: 'A-Z' },
    { label: 'Profession', value: 'profession desc', directionLabel: 'Z-A' },
    { label: 'Experience', value: 'experience asc', directionLabel: 'Ascending' },
    { label: 'Experience', value: 'experience desc', directionLabel: 'Descending' },
    { label: 'Conversion Fees', value: 'conversionFees asc', directionLabel: 'Ascending' },
    { label: 'Conversion Fees', value: 'conversionFees desc', directionLabel: 'Descending' },
    { label: 'Status', value: 'status asc', directionLabel: 'A-Z' },
    { label: 'Status', value: 'status desc', directionLabel: 'Z-A' },
  ];
  const [sortSelected, setSortSelected] = useState(['name asc']);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {
    return true;
  };
  const [queryValue, setQueryValue] = useState('');

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const [consultants, setConsultants] = useState([
    {
      id: '1',
      name: 'John Doe',
      emailId: 'john.doe@example.com',
      contact: '+1 234-567-8900',
      profession: 'Business Consultant',
      experience: '5 years',
      conversionFees: '$500',
      isActive: true,
      type: 'voice call',
    },
    {
      id: '2',
      name: 'Jane Smith',
      emailId: 'jane.smith@example.com',
      contact: '+1 234-567-8901',
      profession: 'Marketing Consultant',
      experience: '8 years',
      conversionFees: '$750',
      isActive: true,
      type: 'chat',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      emailId: 'robert.johnson@example.com',
      contact: '+1 234-567-8902',
      profession: 'IT Consultant',
      experience: '3 years',
      conversionFees: '$400',
      isActive: false,
      type: 'voice call',
    },
    {
      id: '4',
      name: 'Emily Davis',
      emailId: 'emily.davis@example.com',
      contact: '+1 234-567-8903',
      profession: 'Finance Consultant',
      experience: '6 years',
      conversionFees: '$600',
      isActive: true,
      type: 'chat',
    },
    {
      id: '5',
      name: 'Michael Brown',
      emailId: 'michael.brown@example.com',
      contact: '+1 234-567-8904',
      profession: 'HR Consultant',
      experience: '7 years',
      conversionFees: '$650',
      isActive: true,
      type: 'video call',
    },
  ]);

  const toggleStatus = useCallback((id) => {
    setConsultants((prevConsultants) =>
      prevConsultants.map((consultant) =>
        consultant.id === id
          ? { ...consultant, isActive: !consultant.isActive }
          : consultant
      )
    );
  }, []);

  // Filter consultants based on selected tab and search query
  const filteredConsultants = consultants.filter((consultant) => {
    // Filter by tab
    let matchesTab = true;
    if (selected !== 0) {
      const selectedTab = itemStrings[selected].toLowerCase();
      matchesTab = consultant.type.toLowerCase() === selectedTab;
    }

    // Filter by search query
    let matchesQuery = true;
    if (queryValue.trim()) {
      const query = queryValue.toLowerCase();
      matchesQuery =
        consultant.name.toLowerCase().includes(query) ||
        consultant.emailId.toLowerCase().includes(query) ||
        consultant.contact.toLowerCase().includes(query) ||
        consultant.profession.toLowerCase().includes(query);
    }

    return matchesTab && matchesQuery;
  });
  const resourceName = {
    singular: 'consultant',
    plural: 'consultants',
  };

  const rowMarkup = filteredConsultants.map(
    (
      { id, name, emailId, contact, profession, experience, conversionFees, isActive },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span" alignment="start" variant="bodyMd" fontWeight="bold" numeric>
            {index + 1}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{emailId}</IndexTable.Cell>
        <IndexTable.Cell>{contact}</IndexTable.Cell>
        <IndexTable.Cell>{profession}</IndexTable.Cell>
        <IndexTable.Cell>{experience}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="center" numeric>
            {conversionFees}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <label
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '36px',
              height: '20px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => toggleStatus(id)}
              style={{
                opacity: 0,
                width: 0,
                height: 0,
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isActive ? 'var(--p-color-bg-fill-brand)' : 'var(--p-color-bg-fill-selected)',
                borderRadius: '11px',
                transition: 'background-color 0.2s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  height: '16px',
                  width: '16px',
                  left: isActive ? '18px' : '2px',
                  top: '2px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }}
              />
            </span>
          </label>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button variant="tertiary" icon={EditIcon} accessibilityLabel="Edit consultant" />
            <Button variant="tertiary" icon={DuplicateIcon} accessibilityLabel="Duplicate consultant" />
            <Button variant="tertiary" icon={DeleteIcon} tone="critical" accessibilityLabel="Delete consultant" />
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <LegacyCard>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Search consultants"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setQueryValue('')}
        onSort={setSortSelected}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        filters={[]}
        appliedFilters={[]}
        onClearAll={handleQueryValueRemove}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        condensed={useBreakpoints().smDown}
        selectable={false}
        resourceName={resourceName}
        itemCount={filteredConsultants.length}
        headings={[
          { title: 'Sr. No.' },
          { title: 'Name' },
          { title: 'Email Id' },
          { title: 'Contact' },
          { title: 'Profession' },
          { title: 'Experience' },
          { title: 'Conversion Fees', alignment: 'end' },
          { title: 'Status' },
          { title: 'Action' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}

export default IndexTableList;