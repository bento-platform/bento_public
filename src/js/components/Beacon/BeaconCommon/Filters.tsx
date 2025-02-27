import type { Dispatch, SetStateAction } from 'react';
import { Button, Form, Space, Switch, Tooltip } from 'antd';
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
        <p style={{ margin: '5px' }}>
          {t(`beacon.${isFiltersUnion ? 'show_all_filters' : 'common_filters_only'}`)}
        </p>
      </div>
    </Tooltip>
  );
};

// ideally:
// - should not permit you to make multiple queries on the same key (Redmine #1688)

const BUTTON_STYLE = { margin: '10px 0' };

const Filters = ({ filters, setFilters, form, beaconFiltersBySection, isNetworkQuery }: FiltersProps) => {
  const t = useTranslationFn();

  const { maxQueryParameters: maxFilters, maxQueryParametersRequired } = useConfig();
  const activeFilters = filters.filter((f) => f.active);
  const hasMaxFilters = maxQueryParametersRequired && activeFilters.length >= maxFilters;

  // don't need to pull filters from state
  // we only need to know *which* state we are in, so it can be shown in the switch

  // UI starts with an optional filter, which can be left blank
  const isRequired = filters.length > 1;

  const newFilter = (n: number) => ({ index: n, active: true });

  const removeFilter = (filter: FormFilter) => {
    // set to active: false
    setFilters(filters.map((f) => (f.index === filter.index ? { index: filter.index, active: false } : f)));
  };

  const handleAddFilter = () => {
    const filterIndex = filters.length + 1;
    const f = newFilter(filterIndex);
    setFilters((filters) => [...filters, f]);
  };

  return (
    <Form.Item>
      <Space style={{ display: 'flex', padding: 0 }}>
        <Tooltip title={hasMaxFilters ? `${t('maximum of')} ${maxFilters} ${t('filters permitted')}` : null}>
          <Button style={BUTTON_STYLE} onClick={handleAddFilter} disabled={hasMaxFilters}>
            {t('Add Filter')}
          </Button>
        </Tooltip>
        {isNetworkQuery && <NetworkFilterToggle />}
      </Space>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activeFilters.map((f) => (
          <Filter
            key={f.index}
            filter={f}
            form={form}
            beaconFiltersBySection={beaconFiltersBySection}
            removeFilter={removeFilter}
            isRequired={isRequired}
          />
        ))}
      </div>
    </Form.Item>
  );
};

export interface FiltersProps {
  filters: FormFilter[];
  setFilters: Dispatch<SetStateAction<FormFilter[]>>;
  form: FormInstance;
  beaconFiltersBySection: BeaconFilterSection[]
  isNetworkQuery: boolean;
}

export default Filters;
