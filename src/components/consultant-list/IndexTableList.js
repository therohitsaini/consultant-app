import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useBreakpoints,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

/**
 * Reusable IndexTableList component
 * @param {Array} itemStrings - Array of tab labels
 * @param {Array} sortOptions - Array of sort options
 * @param {Array} data - Array of data items to display
 * @param {Array} headings - Array of table column headings
 * @param {Function} renderRow - Function to render each row: (item, index) => JSX
 * @param {Object} resourceName - Object with singular and plural resource names
 * @param {String} queryPlaceholder - Placeholder text for search input
 * @param {Function} onTabChange - Optional callback when tab changes: (selectedIndex) => void
 * @param {Function} onQueryChange - Optional callback when query changes: (query) => void
 * @param {Function} onSortChange - Optional callback when sort changes: (sortValue) => void
 */
function IndexTableList({
  itemStrings = [],
  sortOptions = [],
  data = [],
  headings = [],
  renderRow,
  resourceName = { singular: 'item', plural: 'items' },
  queryPlaceholder = 'Search items',
  onTabChange,
  onQueryChange,
  onSortChange,
}) {
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const [selected, setSelected] = useState(0);
  const [sortSelected, setSortSelected] = useState(sortOptions.length > 0 ? [sortOptions[0].value] : []);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [queryValue, setQueryValue] = useState('');

  const handleTabChange = useCallback(
    (selectedIndex) => {
      setSelected(selectedIndex);
      if (onTabChange) {
        onTabChange(selectedIndex);
      }
    },
    [onTabChange]
  );

  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      if (onQueryChange) {
        onQueryChange(value);
      }
    },
    [onQueryChange]
  );

  const handleQueryValueRemove = useCallback(() => {
    setQueryValue('');
    if (onQueryChange) {
      onQueryChange('');
    }
  }, [onQueryChange]);

  const handleSortChange = useCallback(
    (sortValue) => {
      setSortSelected(sortValue);
      if (onSortChange) {
        onSortChange(sortValue);
      }
    },
    [onSortChange]
  );

  const onHandleCancel = () => {
    return true;
  };

  const rowMarkup = data?.map((item, index) => 
    renderRow ? renderRow(item, index) : null
  ).filter(Boolean);

  return (
    <LegacyCard>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder={queryPlaceholder}
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={handleQueryValueRemove}
        onSort={handleSortChange}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
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
        itemCount={data?.length || 0}
        headings={headings}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}

export default IndexTableList;