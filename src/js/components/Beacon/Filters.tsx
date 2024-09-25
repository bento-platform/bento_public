import type { Dispatch, SetStateAction } from 'react';
import { useAppSelector } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Button, Form, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { FormFilter } from '@/types/beacon';
import type { SearchFieldResponse } from '@/types/search';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import Filter from './Filter';

// ideally:
// - should not permit you to make multiple queries on the same key (Redmine #1688)

const BUTTON_STYLE = { margin: '10px 0' };

const Filters = ({ filters, setFilters, form, querySections }: FiltersProps) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  const maxFilters = useAppSelector((state) => state.config.maxQueryParameters);
  const maxQueryParametersRequired = useAppSelector((state) => state.config.maxQueryParametersRequired);
  const activeFilters = filters.filter((f) => f.active);
  const hasMaxFilters = maxQueryParametersRequired && activeFilters.length >= maxFilters;

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
        <Tooltip title={hasMaxFilters ? `${td('maximum of')} ${maxFilters} ${td('filters permitted')}` : null}>
          <Button style={BUTTON_STYLE} onClick={handleAddFilter} disabled={hasMaxFilters}>
            {td('Add Filter')}
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
