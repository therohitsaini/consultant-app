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
function IndexTableList( {itemStrings, sortOptions ,consultantsFalbackData, setConsultants} ) {
 
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { },
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));
  const [selected, setSelected] = useState(0);
 
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

 

  // const toggleStatus = useCallback((id) => {
  //   setConsultants((prevConsultants) =>
  //     prevConsultants.map((consultant) =>
  //       consultant.id === id
  //         ? { ...consultant, isActive: !consultant.isActive }
  //         : consultant
  //     )
  //   );
  // }, []);

  // Filter consultantsFalbackData based on selected tab and search query
  const filteredConsultants = consultantsFalbackData?.filter((consultant) => {
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
    plural: 'consultantsFalbackData',
  };

  const rowMarkup = filteredConsultants?.map(
    (
      { id, name, emailId, phone, profession, experience, conversionFees, isActive },
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
        <IndexTable.Cell>{phone}</IndexTable.Cell>
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
              // onChange={() => toggleStatus(id)}
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
        queryPlaceholder="Search consultantsFalbackData"
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
        itemCount={filteredConsultants?.length}
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