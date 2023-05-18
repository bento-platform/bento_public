import Filter from './Filter';
import { useAppSelector } from '@/hooks';
import { Button, Form, Tooltip } from 'antd';

// ideally:
// - should not permit you to make multiple queries on the same key

const Filters = ({ filters, setFilters, form, querySections }) => {
  const maxFilters = useAppSelector((state) => state.config.maxQueryParameters);

  const newFilter = (n) => ({ index: ` ${n}`, active: true });

  const removeFilter = (filter) => {
    // set to active: false
    setFilters(filters.map((f) => (f.index == filter.index ? { index: filter.index, active: false } : f)));
  };

  const activeFilters = filters.filter((f) => f.active);

  const hasMaxFilters = activeFilters.length >= maxFilters;

  const handleAddFilter = () => {
    const filterIndex = filters.length + 1;
    const f = newFilter(filterIndex);
    setFilters((filters) => [...filters, f]);
  };

  // const handleClearForm = () => {
  //   setFilters([]);
  //   form.resetFields();
  // };

  const buttonStyle = { margin: '10px 0' };

  return (
    <Form.Item>
      <div style={{ display: 'flex', padding: 0 }}>
        <Tooltip title={hasMaxFilters ? `maximum of ${maxFilters} filters permitted` : null}>
          <Button style={buttonStyle} onClick={handleAddFilter} disabled={hasMaxFilters}>
            Add Filter
          </Button>
        </Tooltip>
      </div>
      <div style={{ minWidth: '480px', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {activeFilters.map((f) => (
          <Filter key={f.index} filter={f} form={form} querySections={querySections} removeFilter={removeFilter} />
        ))}
      </div>
    </Form.Item>
  );
};

export default Filters;
