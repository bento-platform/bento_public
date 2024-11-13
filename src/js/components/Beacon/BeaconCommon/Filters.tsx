import type { Dispatch, SetStateAction } from 'react';
import { Button, Form, Space, Switch, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { useBeaconNetwork } from '@/features/beacon/hooks';
import { useConfig } from '@/features/config/hooks';
import { toggleQuerySectionsUnionOrIntersection } from '@/features/beacon/network.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import type { FormFilter } from '@/types/beacon';
import type { SearchFieldResponse } from '@/types/search';

import Filter from './Filter';

const NetworkFilterToggle = () => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { isQuerySectionsUnion } = useBeaconNetwork();

  return (
    <Tooltip title="Choose all search filters across the network, or only those common to all beacons.">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch
          onChange={() => dispatch(toggleQuerySectionsUnionOrIntersection())}
          checked={isQuerySectionsUnion}
          style={{ margin: '5px' }}
        />
        <p style={{ margin: '5px' }}>
          {t(`beacon.${isQuerySectionsUnion ? 'show_all_filters' : 'common_filters_only'}`)}
        </p>
      </div>
    </Tooltip>
  );
};

// ideally:
// - should not permit you to make multiple queries on the same key (Redmine #1688)

const BUTTON_STYLE = { margin: '10px 0' };

const Filters = ({ filters, setFilters, form, querySections, isNetworkQuery }: FiltersProps) => {
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
            querySections={querySections}
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
  querySections: SearchFieldResponse['sections'];
  isNetworkQuery: boolean;
}

export default Filters;
