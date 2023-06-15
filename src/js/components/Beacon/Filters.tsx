import React, { Dispatch, SetStateAction } from 'react';
import Filter from './Filter';
import { useAppSelector } from '@/hooks';
import { Button, Form, Space, Tooltip } from 'antd';
import { FormInstance} from 'antd/es/form';
import { FormFilter } from '@/types/beacon';
import { SearchFieldResponse } from '@/types/search';

// ideally:
// - should not permit you to make multiple queries on the same key (Redmine #1688)

const BUTTON_STYLE = { margin: '10px 0' };

const Filters = ({ filters, setFilters, form, querySections }: FiltersProps) => {
  const maxFilters = useAppSelector((state) => state.config.maxQueryParameters);
  const activeFilters = filters.filter((f) => f.active);
  const hasMaxFilters = activeFilters.length >= maxFilters;

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
        <Tooltip title={hasMaxFilters ? `maximum of ${maxFilters} filters permitted` : null}>
          <Button style={BUTTON_STYLE} onClick={handleAddFilter} disabled={hasMaxFilters}>
            Add Filter
          </Button>
        </Tooltip>
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
}

export default Filters;
