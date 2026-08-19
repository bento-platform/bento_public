import { type Dispatch, type SetStateAction, useState } from 'react';
import { Button, Flex, Form, Space, Switch, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { useBeaconNetwork } from '@/features/beacon/hooks';
import { toggleQuerySectionsUnionOrIntersection } from '@/features/beacon/network.store';
import { useConfig } from '@/features/config/hooks';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import type { BeaconFilterSection, FormFilter } from '@/types/beacon';

import Filter from './Filter';

const NetworkFilterToggle = () => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { isFiltersUnion } = useBeaconNetwork();

  return (
    <Tooltip title={t('beacon.network_filter_toggle_help')}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch
          onChange={() => dispatch(toggleQuerySectionsUnionOrIntersection())}
          checked={isFiltersUnion}
          style={{ margin: '5px' }}
        />
        <p style={{ margin: '5px' }}>{t(`beacon.${isFiltersUnion ? 'show_all_filters' : 'common_filters_only'}`)}</p>
      </div>
    </Tooltip>
  );
};

const BUTTON_STYLE = { margin: '10px 0' };

const Filters = ({ filters, setFilters, filtersDirty, form, beaconFiltersBySection, isNetworkQuery }: FiltersProps) => {
  const t = useTranslationFn();
  const [filterIndex, setFilterIndex] = useState<number>(1);

  const { maxQueryParameters: maxFilters } = useConfig();
  const hasMaxFilters = filters.length >= maxFilters;

  // don't need to pull filters from state
  // we only need to know *which* state we are in, so it can be shown in the switch

  const newFilter = () => {
    const filter = { index: filterIndex, searchFieldId: null };
    setFilterIndex((i) => i + 1);
    return filter;
  };

  const removeFilter = (filter: FormFilter) => {
    setFilters((filters) => filters.filter((f) => f.index !== filter.index));
  };

  const handleAddFilter = () => {
    const f = newFilter();
    setFilters((filters) => [...filters, f]);
  };

  // update the search field for a particular filter selection in the form
  const setFilterSearchFieldId = (filter: FormFilter, searchFieldId: string) => {
    setFilters((old) =>
      old.map((f) => (f.index === filter.index ? { index: filter.index, searchFieldId: searchFieldId } : f))
    );
  };

  const searchFieldInUse = (searchFieldId: string) => filters.some((f) => f.searchFieldId === searchFieldId);

  return (
    <Form.Item>
      <Space className="p-0" style={{ display: 'flex' }}>
        <Tooltip title={hasMaxFilters ? `${t('maximum of')} ${maxFilters} ${t('filters permitted')}` : null}>
          <Button style={BUTTON_STYLE} onClick={handleAddFilter} disabled={hasMaxFilters}>
            {t('Add Filter')}
          </Button>
        </Tooltip>
        {isNetworkQuery && <NetworkFilterToggle />}
      </Space>
      <Flex vertical={true}>
        {filters.map((f) => (
          <Filter
            key={f.index}
            filter={f}
            form={form}
            beaconFiltersBySection={beaconFiltersBySection}
            removeFilter={removeFilter}
            setFilterSearchFieldId={setFilterSearchFieldId}
            searchFieldInUse={searchFieldInUse}
            isRequired={filtersDirty}
          />
        ))}
      </Flex>
    </Form.Item>
  );
};

export interface FiltersProps {
  filters: FormFilter[];
  setFilters: Dispatch<SetStateAction<FormFilter[]>>;
  filtersDirty: boolean;
  form: FormInstance;
  beaconFiltersBySection: BeaconFilterSection[];
  isNetworkQuery: boolean;
}

export default Filters;
